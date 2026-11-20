// Which versions this server runs: the engine's git commit and the course's. Feedback is only readable if
// we know what the learner was running (a launchable tracks main, so two learners who start minutes apart
// can be on different commits, and a course moves to a new engine when it bumps its submodule). Read once at
// startup; stamped on feedback notes, metrics, the admin page and the report archive.
import { execFileSync, spawnSync } from "node:child_process";
import { config, COURSE_ROOT, ENGINE_ROOT, learnerPythonBin } from "./config.ts";

const git = (dir: string, ...args: string[]) => {
  try { return execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
  catch { return ""; }
};

export interface Version { commit: string; dirty: boolean; date: string; label: string }

/** A repo's commit, and "+changes" if tracked files were edited (the commit alone doesn't say what ran). */
export function repoVersion(dir: string): Version {
  const commit = git(dir, "rev-parse", "--short=10", "HEAD");
  // --ignore-submodules: the course's engine/ pointer is reported as the engine's own version.
  const dirty = commit !== "" && git(dir, "status", "--porcelain", "--untracked-files=no", "--ignore-submodules") !== "";
  return { commit: commit || "unknown", dirty, date: git(dir, "log", "-1", "--format=%cs"), label: commit ? commit + (dirty ? "+changes" : "") : "unknown" };
}

// Where "Report on GitHub" opens a new issue: ISSUES_URL, else the GitHub repo the course was cloned from
// (a fork reports to the fork), else none (the admin page then offers no link).
function issuesUrl(): string {
  if (process.env.ISSUES_URL) return process.env.ISSUES_URL;
  const m = git(COURSE_ROOT, "remote", "get-url", "origin").match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
  return m ? `https://github.com/${m[1]}/${m[2]}/issues/new` : "";
}

const engine = repoVersion(ENGINE_ROOT);
const course = repoVersion(COURSE_ROOT);
// The example course lives inside the engine: one repo, one version.
const sameRepo = git(ENGINE_ROOT, "rev-parse", "--show-toplevel") === git(COURSE_ROOT, "rev-parse", "--show-toplevel");

export const app = {
  engine,
  course,
  /** What to print and stamp: "course <c> · engine <e>", or just the commit when they're one repo. */
  label: sameRepo ? engine.label : `course ${course.label} · engine ${engine.label}`,
  /** For file names: the course's commit (the engine's is in the archive's about.json). */
  commit: course.commit,
  issues: issuesUrl(),
};

let product: string | undefined;
/** What version of the product the learner's runs use, read once: course.yaml `product.version_cmd` run with the
 *  learner's Python first on PATH (a course that tracks the latest release, like Warp, says what's installed),
 *  else the product checkout's commit, else the pinned commit. */
export function productVersion(c: { product: string; commit: string; versionCmd?: string }): string {
  if (product !== undefined) return product;
  let v = "";
  if (c.versionCmd) {
    const r = spawnSync("bash", ["-c", c.versionCmd], { encoding: "utf8", timeout: 30_000, cwd: COURSE_ROOT,
      env: { ...process.env, PATH: `${learnerPythonBin()}:${process.env.PATH}` } });
    v = r.status === 0 ? r.stdout.trim().split("\n").pop()!.trim() : "";
  }
  if (!v) v = git(config.productDir, "rev-parse", "--short=12", "HEAD");
  return (product = v || c.commit.slice(0, 12) || "unknown");
}
