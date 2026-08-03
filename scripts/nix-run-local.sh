#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

encoded="${root//%/%25}"
encoded="${encoded// /%20}"
encoded="${encoded//#/%23}"
encoded="${encoded//\?/%3F}"

exec nix run "path:${encoded}" "$@"
