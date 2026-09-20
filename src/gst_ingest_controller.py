#!/usr/bin/env python3
import argparse
import json
import sys
import threading
import time

import gi

gi.require_version("Gst", "1.0")
gi.require_version("GLib", "2.0")
from gi.repository import GLib, Gst

INPUT_STARTUP_GRACE_SECONDS = 30
INPUT_STALE_SECONDS = 15


def q(value):
    return Gst.value_serialize(str(value))


def build_pipeline(args):
    keyint = args.frame_rate * 2
    video_caps = f"video/x-raw,format=I420,width=1920,height=1080,framerate={args.frame_rate}/1"
    audio_caps = "audio/x-raw,format=F32LE,layout=interleaved,rate=48000,channels=2"
    video_output = [
        f"! {video_caps}",
        "! queue",
        "! x264enc tune=zerolatency speed-preset=ultrafast",
        f"bitrate={args.video_bitrate_kbps}",
        f"key-int-max={keyint}",
        "! video/x-h264,profile=baseline",
        "! tee name=encoded_video",
        "encoded_video. ! queue ! h264parse config-interval=1",
        "! video/x-h264,stream-format=avc,alignment=au ! mux.",
    ]
    audio_output = [
        "! tee name=raw_audio",
        "raw_audio. ! queue ! avenc_aac",
        f"bitrate={args.audio_bitrate}",
        "! aacparse ! queue ! mux.",
    ]
    if args.webrtc_rtsp_url:
        video_output.extend(
            [
                "encoded_video. ! queue ! h264parse config-interval=1",
                "! video/x-h264,stream-format=byte-stream,alignment=au ! rtsp.",
            ]
        )
        audio_output.extend(
            [
                "raw_audio. ! queue ! audioconvert ! opusenc bitrate=96000",
                "! queue ! rtsp.",
                "rtspclientsink name=rtsp protocols=tcp",
                f"location={q(args.webrtc_rtsp_url)}",
            ]
        )
    if args.source_type == "ndi":
        source = [
            "ndisrc", f"ndi-name={q(args.ndi_source)}",
            *([f"url-address={q(args.ndi_url_address)}"] if args.ndi_url_address else []),
            "bandwidth=100", "! ndisrcdemux name=demux",
        ]
        video_pad = "demux.video"
        audio_pad = "demux.audio"
    else:
        source = ["uridecodebin", f"uri={q(args.network_uri)}", "name=demux"]
        video_pad = "demux."
        audio_pad = "demux."
    return " ".join(
        [
            "compositor name=vcomp background=black ignore-inactive-pads=true sink_0::zorder=0 sink_1::zorder=1",
            *video_output,
            "audiomixer name=amix ignore-inactive-pads=true",
            *audio_output,
            "flvmux name=mux streamable=true",
            "! rtmpsink",
            f"location={q(args.rtmp_url)}",
            *source,
            f"{video_pad} ! identity name=source_video_watch silent=true",
            "! queue ! videoconvert ! videoscale ! videorate",
            f"! {video_caps}",
            "! identity name=ndi_video_probe silent=true",
            "! queue ! vcomp.sink_0",
            f"{audio_pad} ! identity name=source_audio_watch silent=true",
            "! queue ! audioconvert ! audioresample",
            f"! {audio_caps}",
            "! identity name=ndi_audio_probe silent=true",
            "! queue ! amix.sink_0",
            "videotestsrc is-live=true pattern=black",
            f"! {video_caps}",
            "! textoverlay",
            f"text={q(args.slate_text)}",
            "halignment=center valignment=center",
            f"font-desc={q('Sans 48')}",
            "! queue ! vcomp.sink_1",
            "audiotestsrc is-live=true wave=silence",
            f"! {audio_caps}",
            "! queue ! amix.sink_1",
        ]
    )


class Controller:
    def __init__(self, args):
        self.args = args
        self.pipeline = None
        self.loop = GLib.MainLoop()
        self.mode = None
        self.requested_mode = args.initial_mode
        self.ndi_video_ready = False
        self.ndi_audio_ready = False
        self.slate_video_pad = None
        self.slate_audio_pad = None
        self.ndi_video_pad = None
        self.ndi_audio_pad = None
        self.transition_source_id = None
        self.heartbeat_source_id = None
        self.stopping = False
        self.input_started_at = time.monotonic()
        self.input_last_seen = {"video": None, "audio": None}

    def emit(self, event, **data):
        print(json.dumps({"event": event, **data}), flush=True)

    def start(self):
        Gst.init(None)
        description = build_pipeline(self.args)
        self.emit("pipeline", description=description)
        self.pipeline = Gst.parse_launch(description)
        if self.args.validate_only:
            self.emit("validated")
            self.pipeline.set_state(Gst.State.NULL)
            return

        bus = self.pipeline.get_bus()
        bus.add_signal_watch()
        bus.connect("message", self.on_message)
        self.configure_pads()
        self.apply_requested_mode()

        self.input_started_at = time.monotonic()
        result = self.pipeline.set_state(Gst.State.PLAYING)
        if result == Gst.StateChangeReturn.FAILURE:
            raise RuntimeError("GStreamer pipeline failed to enter PLAYING")

        outputs = ["rtmp"]
        if self.args.webrtc_rtsp_url:
            outputs.append("rtsp")
        self.emit(
            "ready",
            mode=self.mode,
            requestedMode=self.requested_mode,
            outputs=outputs,
        )
        self.heartbeat_source_id = GLib.timeout_add_seconds(2, self.heartbeat)
        threading.Thread(target=self.read_commands, daemon=True).start()
        try:
            self.loop.run()
        finally:
            self.stopping = True
            if self.heartbeat_source_id is not None:
                GLib.source_remove(self.heartbeat_source_id)
                self.heartbeat_source_id = None
            self.pipeline.set_state(Gst.State.NULL)

    def configure_pads(self):
        # Observe the real source before videorate can duplicate frames or mixers mask EOS.
        for media in ("video", "audio"):
            watch = self.pipeline.get_by_name(f"source_{media}_watch")
            watch.get_static_pad("src").add_probe(
                Gst.PadProbeType.BUFFER | Gst.PadProbeType.EVENT_DOWNSTREAM,
                self.on_source_activity,
                media,
            )

        compositor = self.pipeline.get_by_name("vcomp")
        audio_mixer = self.pipeline.get_by_name("amix")
        self.ndi_video_pad = compositor.get_static_pad("sink_0")
        self.slate_video_pad = compositor.get_static_pad("sink_1")
        self.ndi_audio_pad = audio_mixer.get_static_pad("sink_0")
        self.slate_audio_pad = audio_mixer.get_static_pad("sink_1")

        self.ndi_video_pad.set_property("zorder", 0)
        self.slate_video_pad.set_property("zorder", 1)
        self.ndi_audio_pad.set_property("volume", 0.0)
        self.slate_audio_pad.set_property("volume", 0.0)

        video_probe = self.pipeline.get_by_name("ndi_video_probe")
        audio_probe = self.pipeline.get_by_name("ndi_audio_probe")
        video_probe.get_static_pad("src").add_probe(
            Gst.PadProbeType.BUFFER, self.on_ndi_video_buffer
        )
        audio_probe.get_static_pad("src").add_probe(
            Gst.PadProbeType.BUFFER, self.on_ndi_audio_buffer
        )

    def on_ndi_video_buffer(self, pad, info):
        if not self.ndi_video_ready:
            self.ndi_video_ready = True
            self.emit("input-ready", media="video")
            GLib.idle_add(self.apply_requested_mode)
        return Gst.PadProbeReturn.OK

    def on_ndi_audio_buffer(self, pad, info):
        if not self.ndi_audio_ready:
            self.ndi_audio_ready = True
            self.emit("input-ready", media="audio")
            GLib.idle_add(self.apply_requested_mode)
        return Gst.PadProbeReturn.OK

    def heartbeat(self):
        now = time.monotonic()
        ages = {
            media: None if seen is None else max(0, int((now - seen) * 1000))
            for media, seen in self.input_last_seen.items()
        }
        for media, age in ages.items():
            missing_after_startup = (
                age is None
                and now - self.input_started_at >= INPUT_STARTUP_GRACE_SECONDS
            )
            stale = age is not None and age >= INPUT_STALE_SECONDS * 1000
            if missing_after_startup or stale:
                self.fail_input(media, "no fresh buffers received")
                self.heartbeat_source_id = None
                return False

        self.emit(
            "heartbeat",
            mode=self.mode,
            requestedMode=self.requested_mode,
            inputVideoReady=self.ndi_video_ready,
            inputAudioReady=self.ndi_audio_ready,
            inputVideoAgeMs=ages["video"],
            inputAudioAgeMs=ages["audio"],
        )
        return True

    def on_source_activity(self, pad, info, media):
        if self.stopping:
            return Gst.PadProbeReturn.OK
        if info.type & Gst.PadProbeType.BUFFER:
            self.input_last_seen[media] = time.monotonic()
        elif info.get_event().type == Gst.EventType.EOS:
            # Leave the streaming thread before changing controller state.
            GLib.idle_add(self.fail_input, media, "end of stream received")
        return Gst.PadProbeReturn.OK

    def fail_input(self, media, reason):
        if not self.stopping:
            self.stopping = True
            self.ndi_video_ready = False
            self.ndi_audio_ready = False
            self.emit(
                "error",
                category="input",
                media=media,
                message=f"{media.capitalize()} input unavailable: {reason}; reconnecting.",
            )
            # Process exit lets the existing supervisor recreate the requested scene.
            self.loop.quit()
        return False

    def read_commands(self):
        for line in sys.stdin:
            line = line.strip()
            if not line:
                continue
            try:
                command = json.loads(line)
            except json.JSONDecodeError as error:
                self.emit("warning", message=f"invalid command: {error}")
                continue
            if command.get("type") == "set-mode":
                GLib.idle_add(self.set_mode, command.get("mode"))
            elif command.get("type") == "stop":
                GLib.idle_add(self.stop)

    def set_mode(self, mode):
        if mode not in ("chapel", "sacrament"):
            self.emit("warning", message=f"unsupported mode: {mode}")
            return False
        self.requested_mode = mode
        self.apply_requested_mode()
        return False

    def apply_requested_mode(self):
        effective_mode = self.requested_mode
        if self.mode == effective_mode:
            return False

        ndi_active = effective_mode == "chapel"
        target_slate_alpha = 0.0 if ndi_active else 1.0
        target_ndi_volume = 1.0 if ndi_active else 0.0

        if self.mode is None:
            self.set_mix(target_slate_alpha, target_ndi_volume)
        else:
            self.start_transition(target_slate_alpha, target_ndi_volume, effective_mode)

        self.mode = effective_mode
        self.emit("mode", mode=effective_mode, requestedMode=self.requested_mode)
        return False

    def set_mix(self, slate_alpha, ndi_volume):
        self.ndi_video_pad.set_property("alpha", 1.0)
        self.slate_video_pad.set_property("alpha", slate_alpha)
        self.ndi_audio_pad.set_property("volume", ndi_volume)
        self.slate_audio_pad.set_property("volume", 0.0)

    def start_transition(self, target_slate_alpha, target_ndi_volume, target_mode):
        if self.transition_source_id is not None:
            GLib.source_remove(self.transition_source_id)
            self.transition_source_id = None

        start_slate_alpha = self.slate_video_pad.get_property("alpha")
        start_ndi_volume = self.ndi_audio_pad.get_property("volume")
        duration_seconds = max(0, self.args.transition_duration_ms) / 1000
        if duration_seconds == 0:
            self.set_mix(target_slate_alpha, target_ndi_volume)
            return

        started_at = time.monotonic()
        self.emit(
            "transition",
            mode=target_mode,
            durationMs=self.args.transition_duration_ms,
        )

        def tick():
            progress = min(1.0, (time.monotonic() - started_at) / duration_seconds)
            eased = progress * progress * (3.0 - 2.0 * progress)
            slate_alpha = start_slate_alpha + (
                target_slate_alpha - start_slate_alpha
            ) * eased
            ndi_volume = start_ndi_volume + (
                target_ndi_volume - start_ndi_volume
            ) * eased
            self.set_mix(slate_alpha, ndi_volume)
            if progress < 1.0:
                return True
            self.transition_source_id = None
            self.emit("transition-complete", mode=target_mode)
            return False

        self.transition_source_id = GLib.timeout_add(16, tick)

    def stop(self):
        self.stopping = True
        if self.transition_source_id is not None:
            GLib.source_remove(self.transition_source_id)
            self.transition_source_id = None
        if self.heartbeat_source_id is not None:
            GLib.source_remove(self.heartbeat_source_id)
            self.heartbeat_source_id = None
        self.pipeline.send_event(Gst.Event.new_eos())
        self.loop.quit()
        return False

    def on_message(self, bus, message):
        if message.type == Gst.MessageType.ERROR:
            error, debug = message.parse_error()
            self.emit("error", message=str(error), debug=debug)
            self.loop.quit()
        elif message.type == Gst.MessageType.EOS:
            self.emit("eos")
            self.loop.quit()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-type", choices=["ndi", "rtsp", "srt"], default="ndi")
    parser.add_argument("--ndi-source")
    parser.add_argument("--ndi-url-address")
    parser.add_argument("--network-uri")
    parser.add_argument("--rtmp-url", required=True)
    parser.add_argument("--webrtc-rtsp-url")
    parser.add_argument("--frame-rate", type=int, default=30)
    parser.add_argument("--video-bitrate-kbps", type=int, default=4500)
    parser.add_argument("--audio-bitrate", type=int, default=128000)
    parser.add_argument("--transition-duration-ms", type=int, default=600)
    parser.add_argument(
        "--initial-mode", choices=["chapel", "sacrament"], default="chapel"
    )
    parser.add_argument(
        "--slate-text",
        default="Sacrament in progress - broadcast will return shortly",
    )
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()
    if args.source_type == "ndi" and not args.ndi_source:
        parser.error("--ndi-source is required for NDI")
    if args.source_type != "ndi" and not args.network_uri:
        parser.error("--network-uri is required for network sources")
    Controller(args).start()


if __name__ == "__main__":
    main()
