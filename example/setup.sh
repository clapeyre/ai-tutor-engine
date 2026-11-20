#!/bin/bash
# The example course's learner environment: a venv with NumPy and Matplotlib in example/.envs/learner.
set -euo pipefail
cd "$(dirname "$0")"
[ -x .envs/learner/bin/python ] || uv venv --quiet --python 3.12 .envs/learner
uv pip install --quiet --python .envs/learner/bin/python numpy matplotlib
.envs/learner/bin/python -c "import numpy; print('example env ready: numpy', numpy.__version__)"
