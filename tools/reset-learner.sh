#!/bin/bash
# Start the learner fresh. The current learner/ (progress, conversations, page
# state, tutor sessions, workspace, feedback queue) is archived, never deleted:
# runs/learner-<timestamp>[-label]/. Restarts the dev server if it was running.
#   tools/reset-learner.sh [label]
# The course is COURSE_ROOT (default: the engine's example course).
set -euo pipefail
engine=$(cd "$(dirname "$0")/.." && pwd)
export COURSE_ROOT=$(cd "${COURSE_ROOT:-$engine/example}" && pwd)
cd "$COURSE_ROOT"
label=${1:+-$1}
was_running=0
if [ -f server.pid ] && kill -0 "$(cat server.pid)" 2>/dev/null; then was_running=1; kill "$(cat server.pid)"; sleep 1; fi
if [ -d learner ] && [ -n "$(ls -A learner)" ]; then
  dest="runs/learner-$(date +%m%d-%H%M%S)$label"
  mkdir -p runs
  mv learner "$dest"
  { echo "course $(git rev-parse --short HEAD 2>/dev/null)"; echo "engine $(git -C "$engine" rev-parse --short HEAD 2>/dev/null)"; } > "$dest/COMMIT"
  echo "archived learner/ to $dest"
fi
mkdir -p learner
[ "$was_running" = 1 ] && "$engine/tools/serve.sh" || true
