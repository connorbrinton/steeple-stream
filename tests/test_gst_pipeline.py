import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from gst_ingest_controller import Gst, q


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


if __name__ == "__main__":
    unittest.main()
