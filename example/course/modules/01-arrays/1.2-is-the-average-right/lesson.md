---
id: "1.2"
title: Is the average right?
question: The code ran and the shape is right. Is the answer right?
terms: [dtype]
---

Two grey-scale images are stored as `uint8`: whole numbers from 0 to 255.
You ask the agent for their pixel-by-pixel average, `(a + b) / 2`.

:::your-turn predict-average
title: Two bright pixels
prompt: One pixel is 200 in both images. Predict the average the code gives for it, then ask the tutor to run it.
:::

:::your-turn how-check
title: What would you check?
prompt: The agent says "done, average computed". Without reading its code, what one check would catch this?
:::

:::closure
found: 200 + 200 wrapped around to 144 in `uint8`, so the "average" was 72, with no warning.
matters: A result can have the right shape and no error and still be wrong. Checking one value you know is a cheap receipt.
raises: Where else does a [[dtype]] decide the answer?
:::
