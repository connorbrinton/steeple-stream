#!/usr/bin/env bash
set -euo pipefail

SOURCE_NAME="${1:-Steeple Stream Synthetic}"

exec gst-launch-1.0 -e \
  ndisinkcombiner name=ndi_combiner ! \
    ndisink ndi-name="${SOURCE_NAME}" \
  videotestsrc is-live=true pattern=ball ! \
    video/x-raw,width=1280,height=720,framerate=30/1 ! \
    timeoverlay halignment=left valignment=top font-desc="Sans 28" ! \
    textoverlay text="STEEPLE STREAM SYNTHETIC NDI" \
      halignment=center valignment=bottom font-desc="Sans 32" ! \
    videoconvert ! video/x-raw,format=UYVY ! queue ! ndi_combiner.video \
  audiotestsrc is-live=true wave=sine freq=440 volume=0.05 ! \
    audio/x-raw,format=F32LE,layout=interleaved,rate=48000,channels=2 ! \
    queue ! ndi_combiner.audio
