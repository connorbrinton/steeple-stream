import sys
import time
import unittest
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from gst_ingest_controller import Controller, GLib, Gst, build_pipeline, q


class PipelineStringTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Gst.init(None)

    def test_source_names_round_trip_without_shell_quotes(self):
        for name in ["CHAPEL CAMERA (Chapel Camera, 192.168.110.145)",
                     "Camera's input", 'Camera "wide"', r"Camera\input"]:
            with self.subTest(name=name):
                source = Gst.parse_launch(f"ndisrc ndi-name={q(name)}")
                self.assertEqual(source.get_property("ndi-name"), name)

    def test_overlay_text_round_trips_without_literal_quotes(self):
        text = "Sacrament in progress - broadcast will return shortly"
        overlay = Gst.parse_launch(f"textoverlay text={q(text)}")
        self.assertEqual(overlay.get_property("text"), text)

    def test_both_input_types_wire_monitors_before_frame_duplication(self):
        for source_type in ("ndi", "rtsp"):
            with self.subTest(source_type=source_type):
                args = SimpleNamespace(
                    initial_mode="chapel",
                    source_type=source_type,
                    ndi_source="Synthetic test",
                    ndi_url_address=None,
                    network_uri="rtsp://127.0.0.1:9/test",
                    rtmp_url="rtmp://127.0.0.1:9/test",
                    webrtc_rtsp_url=None,
                    frame_rate=30,
                    video_bitrate_kbps=4500,
                    audio_bitrate=128000,
                    slate_text="Sacrament",
                )
                description = build_pipeline(args)
                self.assertLess(
                    description.index("source_video_watch"),
                    description.index("videorate"),
                )
                controller = Controller(args)
                controller.pipeline = Gst.parse_launch(description)
                try:
                    controller.configure_pads()
                finally:
                    controller.stopping = True
                    controller.pipeline.set_state(Gst.State.NULL)


class InputRecoveryTests(unittest.TestCase):
    def setUp(self):
        Gst.init(None)
        self.reset_controller()

    def reset_controller(self):
        self.controller = Controller(SimpleNamespace(initial_mode="chapel"))
        self.events = []
        self.controller.emit = lambda event, **data: self.events.append(
            {"event": event, **data}
        )

    def test_input_eos_stops_controller_even_when_slate_masks_pipeline_eos(self):
        controller = self.controller
        pipeline = Gst.parse_launch(
            "compositor name=m ! fakesink sync=false "
            "videotestsrc is-live=true num-buffers=10 ! "
            "video/x-raw,width=160,height=90,framerate=30/1 ! "
            "identity name=watch ! m. "
            "videotestsrc is-live=true pattern=black ! "
            "video/x-raw,width=160,height=90,framerate=30/1 ! m."
        )
        pipeline.get_by_name("watch").get_static_pad("src").add_probe(
            Gst.PadProbeType.BUFFER | Gst.PadProbeType.EVENT_DOWNSTREAM,
            controller.on_source_activity,
            "video",
        )
        pipeline_eos = []
        bus = pipeline.get_bus()
        bus.add_signal_watch()
        bus.connect("message::eos", lambda *_: pipeline_eos.append(True))
        timed_out = []

        def timeout():
            timed_out.append(True)
            controller.loop.quit()
            return False

        timer = GLib.timeout_add(3000, timeout)
        try:
            pipeline.set_state(Gst.State.PLAYING)
            controller.loop.run()
            self.assertFalse(timed_out)
            self.assertFalse(pipeline_eos)
            self.assertIsNotNone(controller.input_last_seen["video"])
            self.assertEqual(self.events[-1]["category"], "input")
            self.assertIn("end of stream", self.events[-1]["message"])
        finally:
            controller.stopping = True
            if not timed_out:
                GLib.source_remove(timer)
            pipeline.set_state(Gst.State.NULL)
            bus.remove_signal_watch()

    def test_fresh_buffers_update_heartbeat_age(self):
        now = time.monotonic()
        self.controller.input_last_seen = {"video": now - 0.2, "audio": now - 0.1}
        self.controller.ndi_video_ready = self.controller.ndi_audio_ready = True

        self.assertTrue(self.controller.heartbeat())
        self.assertGreaterEqual(self.events[-1]["inputVideoAgeMs"], 199)
        self.assertLess(self.events[-1]["inputVideoAgeMs"], 1000)

    def test_stale_audio_or_video_triggers_recovery_in_either_scene(self):
        for media in ("video", "audio"):
            for mode in ("chapel", "sacrament"):
                with self.subTest(media=media, mode=mode):
                    self.reset_controller()
                    now = time.monotonic()
                    self.controller.requested_mode = mode
                    self.controller.input_last_seen = {"video": now, "audio": now}
                    self.controller.input_last_seen[media] = now - 16

                    self.assertFalse(self.controller.heartbeat())
                    self.assertEqual(self.events[-1]["media"], media)
                    self.assertFalse(self.controller.ndi_video_ready)
                    self.assertFalse(self.controller.ndi_audio_ready)

    def test_startup_grace_then_missing_input_failure(self):
        self.assertTrue(self.controller.heartbeat())
        self.controller.input_started_at -= 31

        self.assertFalse(self.controller.heartbeat())
        self.assertEqual(self.events[-1]["category"], "input")

    def test_shutdown_and_duplicate_eos_do_not_report_more_failures(self):
        self.controller.fail_input("video", "end of stream")
        self.controller.fail_input("audio", "end of stream")
        self.assertEqual(len(self.events), 1)

        self.reset_controller()
        self.controller.stopping = True
        self.controller.fail_input("video", "end of stream")
        self.assertEqual(self.events, [])


if __name__ == "__main__":
    unittest.main()
