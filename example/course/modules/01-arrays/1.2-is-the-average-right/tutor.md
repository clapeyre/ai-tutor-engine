# 1.2 · tutor notes

**Goal:** the learner sees `uint8` addition wrap around, and names a check
(a known value) that catches it. Probes M-NO-ERROR-RIGHT.

## Your turn `predict-average` (prediction)
- Accept any prediction. When they ask, run in `work/01/average.py`:
  `a = np.array([200], dtype=np.uint8); print((a + a) / 2)`.
- Facts: prints `[72.]` (400 mod 256 = 144). NumPy may print no warning for array addition.
- Show the printed line. Ask why 72. Name **dtype** after they point at the type.
- Settle on the comparison.

## Your turn `how-check` (checkpoint)
- **Pass:** check a value they can compute by hand (200 and 200 average to 200), or the range of the result.
- A fix (cast to a wider type first) is welcome but isn't the check.
- Settle, then `reveal("1.2")`.
