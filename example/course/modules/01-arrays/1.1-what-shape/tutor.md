# 1.1 · tutor notes

**Goal:** the learner predicts the result of `np.arange(3).reshape(3, 1) + np.arange(4)`
and learns that shape mismatches can broadcast instead of failing. Probes M-SHAPE-MISMATCH-ERRORS.

## Your turn `predict-shape` (prediction)
- Accept any prediction. When they ask, run it in `work/01/shape.py`, print the
  result and its shape, and fill slot `result` with the printed array (a code block is fine; no figure needed).
- Facts: the result has shape (3, 4); entry [i, j] is i + j.
- If they predicted an error, ask what rule NumPy must have followed instead.
  Name **broadcasting** only after they describe it.
- Settle on the comparison with their prediction, then `reveal("1.1")`.
