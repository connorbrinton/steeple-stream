#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p artifacts/bin
curl --fail --location --retry 3 --output artifacts/mediamtx.tar.gz \
  https://github.com/bluenviron/mediamtx/releases/download/v1.19.2/mediamtx_v1.19.2_linux_amd64.tar.gz
echo 'f9c601cc303ceca8fad2883917b022882672c5bc56311e92dbceb16e5f20c60c  artifacts/mediamtx.tar.gz' | sha256sum --check
tar -xzf artifacts/mediamtx.tar.gz -C artifacts/bin mediamtx
