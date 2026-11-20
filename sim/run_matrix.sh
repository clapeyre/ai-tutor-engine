#!/usr/bin/env bash
# Every persona against every tutor model, in parallel (one server each), then graded.
#   sim/run_matrix.sh "00,01" aws/anthropic/bedrock-claude-sonnet-5-5 nvidia/nvidia/nemotron-3.5-super-vl
# Personas are the course's sim/personas/*.md (PERSONAS="p*" to pick some). Runs go to the course's runs/.
# Prints the run directories; summarize with: tsx <engine>/sim/summarize.ts runs/<id>...
set -u
engine=$(cd "$(dirname "$0")/.." && pwd)
export COURSE_ROOT=$(cd "${COURSE_ROOT:-$engine/example}" && pwd)
cd "$COURSE_ROOT"
tsx="$engine/node_modules/.bin/tsx"
modules=$1; shift
port=8821
pids=()
for model in "$@"; do
  for p in sim/personas/${PERSONAS:-*}.md; do
    (
      line=$("$tsx" "$engine/sim/app_sim.ts" --persona "$p" --tutor "$model" --modules "$modules" --port $port 2>&1 | grep -v "npm notice" | tail -1)
      echo "$line"
      id=$(echo "$line" | sed -n 's/^\[\([^]]*\)\].*/\1/p')
      [ -n "$id" ] && "$tsx" "$engine/sim/grade.ts" "runs/$id" 2>&1 | grep -v "npm notice" | head -1
    ) &
    pids+=($!)
    port=$((port + 1))
    sleep 45  # staggered: eight sessions starting at once hit the endpoint's burst limit (429)
  done
done
wait "${pids[@]}"
