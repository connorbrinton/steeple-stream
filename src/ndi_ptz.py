#!/usr/bin/env python3
import argparse
import ctypes
import ctypes.util
import sys
import time


class NDIlibSource(ctypes.Structure):
    _fields_ = [
        ("p_ndi_name", ctypes.c_char_p),
        ("p_url_address", ctypes.c_char_p),
    ]


class NDIlibRecvCreateV3(ctypes.Structure):
    _fields_ = [
        ("source_to_connect_to", NDIlibSource),
        ("color_format", ctypes.c_int),
        ("bandwidth", ctypes.c_int),
        ("allow_video_fields", ctypes.c_bool),
        ("p_ndi_recv_name", ctypes.c_char_p),
    ]


NDILIB_RECV_COLOR_FORMAT_FASTEST = 100
NDILIB_RECV_BANDWIDTH_METADATA_ONLY = -10
NDILIB_FRAME_TYPE_STATUS_CHANGE = 100


def main():
    parser = argparse.ArgumentParser(description="NDI PTZ control helper")
    subparsers = parser.add_subparsers(dest="command", required=True)
    recall = subparsers.add_parser("recall-preset")
    recall.add_argument("--source", required=True)
    recall.add_argument("--url-address", default="")
    recall.add_argument("--preset", required=True, type=int)
    recall.add_argument("--speed", default=1.0, type=float)
    recall.add_argument("--wait-ms", default=3000, type=int)
    recall.add_argument("--settle-ms", default=750, type=int)
    check = subparsers.add_parser("check-support")
    check.add_argument("--source", required=True)
    check.add_argument("--url-address", default="")
    check.add_argument("--wait-ms", default=3000, type=int)
    args = parser.parse_args()

    if args.command == "recall-preset":
        recall_preset(args)
    elif args.command == "check-support":
        check_support(args)


def recall_preset(args):
    with ndi_receiver(args) as (ndi, recv):
        wait_for_ptz_support(ndi, recv, args.wait_ms)
        ok = ndi.NDIlib_recv_ptz_recall_preset(recv, args.preset, ctypes.c_float(args.speed))
        if not ok:
            raise SystemExit(f"NDI preset recall failed for preset {args.preset}")
        settle_after_send(ndi, recv, args.settle_ms)
        print(f"recalled preset={args.preset} speed={args.speed}")


def check_support(args):
    with ndi_receiver(args) as (ndi, recv):
        wait_for_ptz_support(ndi, recv, args.wait_ms)
        print("ptz-supported=true")


class ndi_receiver:
    def __init__(self, args):
        self.args = args
        self.ndi = None
        self.recv = None

    def __enter__(self):
        args = self.args
        ndi = load_ndi()
        configure_signatures(ndi)
        if not ndi.NDIlib_initialize():
            raise SystemExit("NDI runtime failed to initialize")

        source = NDIlibSource(args.source.encode("utf-8"), args.url_address.encode("utf-8") if args.url_address else None)
        create = NDIlibRecvCreateV3(source, NDILIB_RECV_COLOR_FORMAT_FASTEST, NDILIB_RECV_BANDWIDTH_METADATA_ONLY, False, b"Steeple Stream PTZ")
        recv = ndi.NDIlib_recv_create_v3(ctypes.byref(create))
        if not recv:
            ndi.NDIlib_destroy()
            raise SystemExit("Could not create NDI receiver")
        self.ndi = ndi
        self.recv = recv
        return ndi, recv

    def __exit__(self, _exc_type, _exc, _traceback):
        if self.recv:
            self.ndi.NDIlib_recv_destroy(self.recv)
        if self.ndi:
            self.ndi.NDIlib_destroy()


def wait_for_ptz_support(ndi, recv, wait_ms):
    deadline = time.monotonic() + (wait_ms / 1000)
    while time.monotonic() < deadline:
        if ndi.NDIlib_recv_ptz_is_supported(recv):
            return
        ndi.NDIlib_recv_capture_v3(recv, None, None, None, 250)
    if ndi.NDIlib_recv_ptz_is_supported(recv):
        return
    raise SystemExit("NDI source did not advertise PTZ support")


def settle_after_send(ndi, recv, settle_ms):
    deadline = time.monotonic() + (settle_ms / 1000)
    while time.monotonic() < deadline:
        ndi.NDIlib_recv_capture_v3(recv, None, None, None, 50)


def load_ndi():
    candidates = [
        ctypes.util.find_library("ndi"),
        "libndi.so",
        "libndi.so.5",
        "libndi.so.6",
    ]
    for candidate in candidates:
        if not candidate:
            continue
        try:
            return ctypes.CDLL(candidate)
        except OSError:
            pass
    raise SystemExit("Could not load libndi.so; run through the Steeple Stream flake runtime")


def configure_signatures(ndi):
    ndi.NDIlib_initialize.restype = ctypes.c_bool
    ndi.NDIlib_destroy.restype = None
    ndi.NDIlib_recv_create_v3.argtypes = [ctypes.POINTER(NDIlibRecvCreateV3)]
    ndi.NDIlib_recv_create_v3.restype = ctypes.c_void_p
    ndi.NDIlib_recv_destroy.argtypes = [ctypes.c_void_p]
    ndi.NDIlib_recv_destroy.restype = None
    ndi.NDIlib_recv_capture_v3.argtypes = [
        ctypes.c_void_p,
        ctypes.c_void_p,
        ctypes.c_void_p,
        ctypes.c_void_p,
        ctypes.c_uint32,
    ]
    ndi.NDIlib_recv_capture_v3.restype = ctypes.c_int
    ndi.NDIlib_recv_ptz_is_supported.argtypes = [ctypes.c_void_p]
    ndi.NDIlib_recv_ptz_is_supported.restype = ctypes.c_bool
    ndi.NDIlib_recv_ptz_recall_preset.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_float]
    ndi.NDIlib_recv_ptz_recall_preset.restype = ctypes.c_bool


if __name__ == "__main__":
    main()
