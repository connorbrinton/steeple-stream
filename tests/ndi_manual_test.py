import importlib.util
from pathlib import Path
from unittest.mock import MagicMock, patch
from types import SimpleNamespace
import unittest

spec = importlib.util.spec_from_file_location("ndi_ptz", Path(__file__).parent.parent / "src/ndi_ptz.py")
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


class ManualControlTest(unittest.TestCase):
    def run_helper(self, chunks, selections, times, raises=None):
        ndi = MagicMock()
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
        self.assertEqual(calls[0].args, ("fake-receiver", 0.3, 0))
        self.assertEqual(calls[1].args, ("fake-receiver", 0, 0))
        self.assertEqual(calls[2].args, ("fake-receiver", 0, 0))

    def test_eof(self):
        ndi = self.run_helper([b''], [([0], [], [])], [])
        ndi.NDIlib_recv_ptz_zoom_speed.assert_called_with("fake-receiver", 0)

    def test_bad_command(self):
        ndi = self.run_helper([b'{"pan":2,"tilt":0,"zoom":0}\n'], [([0], [], [])], [], ValueError)
        ndi.NDIlib_recv_ptz_pan_tilt_speed.assert_called_with("fake-receiver", 0, 0)

    def test_buffered_stop(self):
        ndi = self.run_helper([b'{"pan":0.3,"tilt":0,"zoom":0}\n{"pan":0,"tilt":0,"zoom":0}\n', b''],
                             [([0], [], []), ([0], [], [])], [0, 0])
        self.assertEqual(ndi.NDIlib_recv_ptz_pan_tilt_speed.call_args_list[1].args, ("fake-receiver", 0, 0))


if __name__ == "__main__":
    unittest.main()
