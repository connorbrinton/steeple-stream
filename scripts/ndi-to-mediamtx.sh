#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 '<NDI source name>' [rtmp-url]" >&2
  exit 64
fi

NDI_SOURCE="$1"
RTMP_URL="${2:-rtmp://127.0.0.1:1935/stakecenter}"
NDI_NIX_PACKAGE="${STEEPLE_NDI_NIX_PACKAGE:-nixpkgs#ndi}"

PLUGIN_OUTPUTS="$(nix build --no-link --print-out-paths \
  .#gst-plugin-ndi \
  nixpkgs#gst_all_1.gstreamer.out \
  nixpkgs#gst_all_1.gst-plugins-base \
  nixpkgs#gst_all_1.gst-plugins-good \
  nixpkgs#gst_all_1.gst-plugins-bad \
  nixpkgs#gst_all_1.gst-plugins-ugly \
  nixpkgs#gst_all_1.gst-libav)"
PLUGIN_PATH="$(printf '%s\n' "${PLUGIN_OUTPUTS}" | while IFS= read -r output; do printf '%s/lib/gstreamer-1.0:' "${output}"; done)"
NDI_OUTPUTS="$(NIXPKGS_ALLOW_UNFREE=1 nix build --impure --no-link --print-out-paths "${NDI_NIX_PACKAGE}")"
NDI_LIBRARY_PATH="$(printf '%s\n' "${NDI_OUTPUTS}" | while IFS= read -r output; do printf '%s/lib:' "${output}"; done)"

export GST_PLUGIN_PATH="${PLUGIN_PATH%:}${GST_PLUGIN_PATH:+:${GST_PLUGIN_PATH}}"
export LD_LIBRARY_PATH="${NDI_LIBRARY_PATH%:}${STEEPLE_NDI_RUNTIME_DIR:+:${STEEPLE_NDI_RUNTIME_DIR}}${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}"

exec nix shell \
  nixpkgs#gst_all_1.gstreamer \
  nixpkgs#gst_all_1.gst-plugins-base \
  nixpkgs#gst_all_1.gst-plugins-good \
  nixpkgs#gst_all_1.gst-plugins-bad \
  nixpkgs#gst_all_1.gst-plugins-ugly \
  nixpkgs#gst_all_1.gst-libav \
  --command gst-launch-1.0 -e \
    ndisrc ndi-name="${NDI_SOURCE}" bandwidth=100 ! \
    ndisrcdemux name=demux \
    demux.video ! queue ! videoconvert ! videorate ! \
      video/x-raw,format=I420,framerate=30/1 ! \
      x264enc tune=zerolatency speed-preset=veryfast bitrate=4500 key-int-max=60 ! \
      h264parse config-interval=1 ! queue ! mux. \
    demux.audio ! queue ! audioconvert ! audioresample ! \
      avenc_aac bitrate=128000 ! aacparse ! queue ! mux. \
    flvmux name=mux streamable=true ! \
      rtmpsink location="${RTMP_URL}"
