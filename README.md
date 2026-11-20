# AI tutor engine

The app behind an agent-first course: a textbook page in the browser, and an LLM
tutor (pi SDK, any OpenAI- or Anthropic-style endpoint) that runs real work in the
learner's workspace behind it. It was written for
[cuPhoton Learn](https://github.com/clapeyre/cuphoton-tutor) and split out of it
(first commit) so other courses can use it. NVIDIA Warp is the second.

## Engine and course

| Engine (this repo, same for every course) | Course (its own repo) |
|---|---|
| `server/`, `web/` | `course/`: `course.yaml`, `modules/`, `vocabulary.yaml`, `concepts.yaml`, `misconceptions.md`, `smoke.ts` |
| `tutor/SYSTEM.md`: the teaching contract, with `{{slots}}` | `tutor/COURSE.md`: the blocks that fill the slots |
| `tutor/skills/{unstick,adapt-pace,report-feedback}` | `tutor/skills/<product>/`: the product's working layer |
| `tutor/pi-agent/models.json` | `.env`, `learner/`, `.envs/`, `.product/` (checkout), `runs/` |
| `sim/`: app_sim, grade, bug_review, summarize, watch, rubric, learner rules | `sim/personas/*.md` |
| `media/pipeline/`: narration (Kokoro) and rendering (Manim) | `media/`: `scripts/`, `scenes/`, `videos/`, `videos.yaml` |
| `tools/`: dev, serve, smoke, ws-drive, reset-learner, renumber-learner, endpoint_check | `tools/install.sh` etc.: install the product |

The server finds the course through `COURSE_ROOT` (see `server/config.ts`); without
it, it serves `example/`, a two-lesson NumPy course that needs no product and no GPU.

## A course uses the engine as a git submodule

    git submodule add <engine-url> engine
    npm --prefix engine ci && npm --prefix engine run build

and calls into it, e.g. in the course's `package.json`:

    "start": "COURSE_ROOT=. engine/node_modules/.bin/tsx engine/server/index.ts",
    "smoke": "COURSE_ROOT=. engine/node_modules/.bin/tsx engine/tools/smoke.ts"

To take engine fixes: `cd engine && git pull`, run a short sim, commit the new pointer.
The server stamps both commits (course and engine) on feedback, metrics, the admin
page and report archives.

## The product

`course.yaml`'s `product` names the software the course teaches. `commit` pins it
(the smoke test checks the checkout is there); leave it out to track the latest
release, and give `version_cmd`, a command that prints the installed version, so
every feedback note and report says what the learner actually ran.

## Try it on the example course

    npm ci
    example/setup.sh        # example/.envs/learner: NumPy (uv)
    npm run build
    npm run smoke
    npm start               # http://127.0.0.1:8765
