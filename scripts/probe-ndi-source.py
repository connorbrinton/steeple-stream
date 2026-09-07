#!/usr/bin/env python3
import argparse
import json
import os
import tempfile

import gi

gi.require_version("Gst", "1.0")
gi.require_version("GLib", "2.0")
from gi.repository import GLib, Gst


def emit(event, **data):
    print(json.dumps({"event": event, **data}), flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("--url-address")
    parser.add_argument("--seconds", type=int, default=10)
    parser.add_argument("--tcp-only", action="store_true")
    args = parser.parse_args()

    config_dir = tempfile.TemporaryDirectory(prefix="steeple-ndi-probe-")
    if args.tcp_only:
        with open(os.path.join(config_dir.name, "ndi-config.v1.json"), "w") as config:
            json.dump({"ndi": {name: {"recv": {"enable": False}} for name in ("rudp", "tcp", "unicast", "multicast")}}, config)
        os.environ["NDI_CONFIG_DIR"] = config_dir.name
    Gst.init(None)
    source = Gst.value_serialize(args.source)
    address = (
        f" url-address={Gst.value_serialize(args.url_address)}" if args.url_address else ""
    )
    pipeline = Gst.parse_launch(
        " ".join(
            [
                f"ndisrc ndi-name={source}{address} bandwidth=100",
                "! ndisrcdemux name=demux",
                "demux.video ! queue ! identity name=video_probe silent=true ! fakesink sync=false",
                "demux.audio ! queue ! identity name=audio_probe silent=true ! fakesink sync=false",
            ]
        )
    )
    loop = GLib.MainLoop()
    seen = set()

    def on_buffer(media):
        def callback(pad, info):
            if media not in seen:
                seen.add(media)
                emit("buffer", media=media)
                if seen == {"audio", "video"}:
                    emit("success")
                    loop.quit()
            return Gst.PadProbeReturn.OK

        return callback

    for media in ("video", "audio"):
        pipeline.get_by_name(f"{media}_probe").get_static_pad("src").add_probe(
            Gst.PadProbeType.BUFFER, on_buffer(media)
        )

    bus = pipeline.get_bus()
    bus.add_signal_watch()

    def on_message(bus, message):
        if message.type == Gst.MessageType.ERROR:
            error, debug = message.parse_error()
            emit("error", message=str(error), debug=debug)
            loop.quit()
        elif message.type == Gst.MessageType.EOS:
            emit("eos")
            loop.quit()

    bus.connect("message", on_message)
    GLib.timeout_add_seconds(args.seconds, lambda: (emit("timeout", seen=sorted(seen)), loop.quit(), False)[-1])
    pipeline.set_state(Gst.State.PLAYING)
    try:
        loop.run()
    finally:
        pipeline.set_state(Gst.State.NULL)
        config_dir.cleanup()

    raise SystemExit(0 if seen == {"audio", "video"} else 1)


if __name__ == "__main__":
    main()
