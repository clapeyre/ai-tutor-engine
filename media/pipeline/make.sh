#!/usr/bin/env bash
# Usage: pipeline/make.sh <video-id>   Narrate, render and assemble one video into $VIDEOS_OUT.
# If the scene uses data, make it first (the course's own step, e.g. media/data.sh) into $VIDEO_DATA.
set -euo pipefail
source "$(dirname "$0")/env.sh"
python "$MEDIA/pipeline/narrate.py" "$1"
"$MEDIA/pipeline/render.sh" "$1"
