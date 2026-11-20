# Misconception catalogue

Each entry: the belief, the truth, a **probe** that surfaces it without naming it.

### M-SHAPE-MISMATCH-ERRORS: "Adding arrays of different shapes raises an error."
- **Truth:** Shapes that are compatible under broadcasting combine silently, often into a bigger array.
- **Docs:** https://numpy.org/doc/stable/user/basics.broadcasting.html
- **Probe:** "What shape does a (3, 1) plus a (4,) give?"
- **Modules:** 01

### M-NO-ERROR-RIGHT: "It ran without errors, so the numbers are right."
- **Truth:** Overflow, wrong axes and wrong units all run cleanly.
- **Probe:** "The agent says it's done. What's the first thing you'd check?"
- **Modules:** 01
