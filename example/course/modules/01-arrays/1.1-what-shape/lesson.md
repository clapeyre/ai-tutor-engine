---
id: "1.1"
title: What shape comes out?
question: You add a column of 3 numbers to a row of 4. Error, or something else?
terms: [shape, broadcasting]
guide: [basics.broadcasting]
---

Every NumPy array has a [[shape]]: how many entries it has along each axis.
A column of 3 numbers has shape (3, 1); a row of 4 has shape (4,).

:::your-turn predict-shape
title: Column plus row
prompt: The tutor will add a (3, 1) array to a (4,) array. Predict what happens (an error, or a result of some shape), then ask it to run.
:::

:::slot result
title: What actually came out
caption: The tutor puts the result here.
:::

:::closure
found: NumPy stretched both arrays to (3, 4) and added them: no error.
matters: Mismatched shapes don't always fail. An agent that mixes up a row and a column gets a bigger array, not an exception.
raises: If the code runs and the shape is right, is the answer right?
:::
