# Example course

A two-lesson course on NumPy, inside the engine so the engine runs, smoke-tests and
sims on its own, with no product to install and no GPU. It is also the smallest
working example of a course's files:

    course/course.yaml        brand, product, run rules, objectives, module list
    course/modules/<m>/       module.yaml, and one folder per lesson: lesson.md (the page), tutor.md (tutor only)
    course/vocabulary.yaml    target terms, introduce_at, hold-backs
    course/concepts.yaml      concept graph, L0–L3 with a placement question each
    course/misconceptions.md  the catalogue, a probe per entry
    tutor/COURSE.md           the blocks that fill tutor/SYSTEM.md's {{slots}}
    tutor/skills/             the course's own skills (none here)
    sim/personas/*.md         simulated learners, with hidden beliefs
    media/videos.yaml         video metadata (none here)

The server uses it when COURSE_ROOT is unset. `example/setup.sh` makes its Python (NumPy, with uv);
then `npm run build`, `npm run smoke`, `npm start`.
