// Runtime configuration. Everything a compute centre may need to change is an
// environment variable (or a line in the course's .env); nothing else is read at startup.
//
// Two roots:
//   ENGINE_ROOT  this repo: the app, the page (web/dist), the tutor's contract (tutor/SYSTEM.md),
//                the engine's skills and tutor/pi-agent/models.json. The same for every course.
//   COURSE_ROOT  the course repo: course/, media/, tutor/COURSE.md, the course's skills, .env,
//                learner/, .envs/, runs/. COURSE_ROOT in the environment; without it, the example
//                course inside the engine (example/), so the engine runs and tests on its own.
import fs from "node:fs";
import path from "node:path";

export const ENGINE_ROOT = path.resolve(import.meta.dirname, "..");
export const COURSE_ROOT = path.resolve(process.env.COURSE_ROOT || path.join(ENGINE_ROOT, "example"));

function loadDotEnv(file: string) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}
loadDotEnv(path.join(COURSE_ROOT, ".env"));

const env = (k: string, d: string) => process.env[k] ?? d;
const inCourse = (p: string) => path.resolve(COURSE_ROOT, p);
const inEngine = (p: string) => path.resolve(ENGINE_ROOT, p);

export const config = {
  port: Number(env("PORT", "8765")),
  host: env("HOST", "127.0.0.1"), // reached over an SSH tunnel; don't bind publicly
  // The course's side.
  courseDir: inCourse(env("COURSE_DIR", "course")),
  mediaDir: inCourse(env("MEDIA_DIR", "media")),
  courseTutorDir: inCourse("tutor"), // COURSE.md, skills/<product>
  learnerDir: inCourse(env("LEARNER_DIR", "learner")),
  // The engine's side.
  engineTutorDir: inEngine("tutor"), // SYSTEM.md, skills/{unstick,adapt-pace,report-feedback}, pi-agent/
  webDist: inEngine(env("WEB_DIST", "web/dist")),
  // A checkout of the software the course teaches (course.yaml `product`): its docs and examples are the
  // tutor's ground truth. At the course's pinned commit if it has one; otherwise whatever the install fetched.
  productDir: inCourse(env("PRODUCT_DIR", ".product")),
  // Python for the learner workspace, put first on the tutor's PATH: a venv's bin/ dir.
  // Default: the course's .envs/learner/bin, else <productDir>/.venv/bin (learnerPythonBin below).
  pythonBin: env("LEARNER_PYTHON_BIN", ""),
  // A second environment with GPU packages, for courses that keep the default one CPU-only (the prompt's
  // {{gpuPythonBin}}). The course's install makes it.
  gpuPythonBin: inCourse(env("LEARNER_GPU_PYTHON_BIN", ".envs/gpu/bin")),
  // Inference: any OpenAI- or Anthropic-style endpoint. Provider + model are
  // looked up in tutor/pi-agent/models.json (add a provider there for a new site).
  provider: env("TUTOR_PROVIDER", "nvidia"),
  model: env("TUTOR_MODEL", "aws/anthropic/bedrock-claude-sonnet-5-5"),
  // "off" sends no reasoning effort, so the model runs at its provider's default, which isn't off: on the NVIDIA
  // endpoint (probed 20 Nov) Sonnet 5.5 then reasons as at high, hidden; GPT and Gemini at about their medium;
  // Kimi and Qwen always reason. A level is sent only for models marked "reasoning" in models.json.
  thinking: env("TUTOR_THINKING", "off") as "off" | "minimal" | "low" | "medium" | "high",
  feedbackUrl: env("FEEDBACK_URL", ""),
  offline: env("PI_OFFLINE", "1") === "1",
};

/** The learner's Python: LEARNER_PYTHON_BIN, else the course's .envs/learner, else the product checkout's .venv. */
export function learnerPythonBin(): string {
  if (config.pythonBin) return path.resolve(COURSE_ROOT, config.pythonBin);
  const own = inCourse(".envs/learner/bin");
  return fs.existsSync(own) ? own : path.join(config.productDir, ".venv", "bin");
}

export function learnerPath(...p: string[]) {
  return path.join(config.learnerDir, ...p);
}
