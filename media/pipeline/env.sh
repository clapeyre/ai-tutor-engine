# Sourced by the pipeline scripts (or by you: `source <engine>/media/pipeline/env.sh`).
# The pipeline is the engine's; the videos are the course's: scripts/, scenes/, renders/, videos/ under
# $MEDIA (default: $COURSE_ROOT/media, else the media/ next to the engine checkout's parent, i.e. a course
# that has the engine as its engine/ submodule). A course can add its own settings in $MEDIA/pipeline.env.
# Every variable can be overridden from the environment.
MEDIA_PIPELINE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd); export MEDIA_PIPELINE
if [ -z "${MEDIA:-}" ]; then
  if [ -n "${COURSE_ROOT:-}" ]; then MEDIA=$COURSE_ROOT/media; else MEDIA=$(cd "$MEDIA_PIPELINE/../../.." && pwd)/media; fi
fi
export MEDIA
[ -d "$MEDIA" ] || { echo "no course media/ at $MEDIA; set COURSE_ROOT or MEDIA" >&2; return 1 2>/dev/null || exit 1; }
tools=${XDG_DATA_HOME:-$HOME/.local/share}/course-media
export MEDIA_VENV=${MEDIA_VENV:-$tools/venv}       # manim + kokoro (pipeline/setup.sh), shared by all courses
export HF_HOME=${HF_HOME:-$tools/hf}               # Kokoro-82M weights
export MEDIA_RENDERS=${MEDIA_RENDERS:-$MEDIA/renders}  # per-video intermediates: audio/, manim/, timings.json
export VIDEO_DATA=${VIDEO_DATA:-$MEDIA_RENDERS/data}   # data the scenes read (the course's own data step)
export VIDEOS_OUT=${VIDEOS_OUT:-$MEDIA/videos}         # final <id>.mp4 + <id>.srt, served by the app
export QUALITY=${QUALITY:-m}                           # manim -q: l=480p15, m=720p30 (drafts), h=1080p60
[ -f "$MEDIA/pipeline.env" ] && source "$MEDIA/pipeline.env"
case ":$PATH:" in *":$MEDIA_VENV/bin:"*) ;; *) export PATH=$MEDIA_VENV/bin:$PATH ;; esac
