import importlib.util
from pathlib import Path
from unittest.mock import MagicMock, patch
from types import SimpleNamespace
import unittest

spec = importlib.util.spec_from_file_location("ndi_ptz", Path(__file__).parent.parent / "src/ndi_ptz.py")
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


class ManualControlTest(unittest.TestCase):
    def run_helper(self, chunks, selections, times, raises=None, ndi=None):
        ndi = ndi if ndi is not None else MagicMock()
        receiver = MagicMock()
        receiver.__enter__.return_value = (ndi, "fake-receiver")
        with patch.object(helper, "ndi_receiver", return_value=receiver), \
             patch.object(helper, "wait_for_ptz_support"), \
             patch.object(helper, "settle_after_send"), \
             patch.object(helper.signal, "signal"), \
             patch.object(helper.sys, "stdin") as stdin, \
             patch.object(helper.os, "read", side_effect=chunks), \
             patch.object(helper.select, "select", side_effect=selections), \
             patch.object(helper.time, "monotonic", side_effect=times):
            stdin.fileno.return_value = 0
            if raises:
                with self.assertRaises(raises):
                    helper.manual_control(SimpleNamespace(wait_ms=3000))
            else:
                helper.manual_control(SimpleNamespace(wait_ms=3000))
        return ndi

    def test_watchdog(self):
        ndi = self.run_helper([b'{"pan":0.3,"tilt":0,"zoom":0}\n', b''],
                             [([0], [], []), ([], [], []), ([0], [], [])], [0, 0.1, 0.8])
        calls = ndi.NDIlib_recv_ptz_pan_tilt_speed.call_args_list
        self.assertEqual(calls[0].args, ("fake-receiver", -0.3, 0))
        self.assertEqual(calls[1].args, ("fake-receiver", 0, 0))
        self.assertEqual(len(calls), 2)
        self.assertEqual(ndi.NDIlib_recv_ptz_zoom_speed.call_count, 2)

    def test_pan_directions_preserve_tilt_and_zoom(self):
        for pan in (-0.4, 0.4):
            with self.subTest(pan=pan):
                command = f'{{"pan":{pan},"tilt":0.2,"zoom":0.6}}\n'.encode()
                ndi = self.run_helper([command, b''],
                                     [([0], [], []), ([0], [], [])], [0, 0.1])
                self.assertEqual(ndi.NDIlib_recv_ptz_pan_tilt_speed.call_args_list[0].args,
                                 ("fake-receiver", -pan, 0.2))
                self.assertEqual(ndi.NDIlib_recv_ptz_zoom_speed.call_args_list[0].args,
                                 ("fake-receiver", 0.6))

    def test_eof(self):
        ndi = self.run_helper([b''], [([0], [], [])], [])
        ndi.NDIlib_recv_ptz_zoom_speed.assert_not_called()
        ndi.NDIlib_recv_ptz_pan_tilt_speed.assert_not_called()

    def test_active_eof_stops_movement(self):
        ndi = self.run_helper([b'{"pan":0.3,"tilt":0,"zoom":0}\n', b''],
                             [([0], [], []), ([0], [], [])], [0, 0.1])
        self.assertEqual(ndi.NDIlib_recv_ptz_pan_tilt_speed.call_count, 2)
        ndi.NDIlib_recv_ptz_pan_tilt_speed.assert_called_with("fake-receiver", 0, 0)
        ndi.NDIlib_recv_ptz_zoom_speed.assert_called_with("fake-receiver", 0)

    def test_bad_command(self):
        ndi = self.run_helper([b'{"pan":2,"tilt":0,"zoom":0}\n'], [([0], [], [])], [], ValueError)
        ndi.NDIlib_recv_ptz_pan_tilt_speed.assert_not_called()
        ndi.NDIlib_recv_ptz_zoom_speed.assert_not_called()

    def test_bad_command_while_moving_stops(self):
        ndi = self.run_helper([b'{"pan":0.3,"tilt":0,"zoom":0}\n{"pan":2,"tilt":0,"zoom":0}\n'],
                             [([0], [], [])], [0], ValueError)
        ndi.NDIlib_recv_ptz_pan_tilt_speed.assert_called_with("fake-receiver", 0, 0)

    def test_partial_movement_failure_stops(self):
        ndi = MagicMock()
        ndi.NDIlib_recv_ptz_zoom_speed.side_effect = [False, True]
        self.run_helper([b'{"pan":0.3,"tilt":0,"zoom":0}\n'],
                        [([0], [], [])], [], RuntimeError, ndi)
        self.assertEqual(ndi.NDIlib_recv_ptz_pan_tilt_speed.call_count, 2)
        ndi.NDIlib_recv_ptz_pan_tilt_speed.assert_called_with("fake-receiver", 0, 0)

    def test_failed_release_is_retried_during_cleanup(self):
        ndi = MagicMock()
        ndi.NDIlib_recv_ptz_zoom_speed.side_effect = [True, False, True]
        self.run_helper([b'{"pan":0.3,"tilt":0,"zoom":0}\n{"pan":0,"tilt":0,"zoom":0}\n'],
                        [([0], [], [])], [0], RuntimeError, ndi)
        self.assertEqual(ndi.NDIlib_recv_ptz_pan_tilt_speed.call_count, 3)
        ndi.NDIlib_recv_ptz_zoom_speed.assert_called_with("fake-receiver", 0)

    def test_buffered_stop(self):
        ndi = self.run_helper([b'{"pan":0.3,"tilt":0,"zoom":0}\n{"pan":0,"tilt":0,"zoom":0}\n', b''],
                             [([0], [], []), ([0], [], [])], [0, 0])
        self.assertEqual(ndi.NDIlib_recv_ptz_pan_tilt_speed.call_args_list[1].args, ("fake-receiver", 0, 0))
        # An external controller may now move the camera; EOF sends no extra stop.
        self.assertEqual(ndi.NDIlib_recv_ptz_pan_tilt_speed.call_count, 2)
        self.assertEqual(ndi.NDIlib_recv_ptz_zoom_speed.call_count, 2)


if __name__ == "__main__":
    unittest.main()
