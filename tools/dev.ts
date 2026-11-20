// npm run dev: the server at the usual address, restarted when its code, the course or the tutor's
// prompt changes, and the page rebuilt into web/dist on every save (reload the browser to see it).
// A restart cuts off a tutor turn in progress; the conversation itself survives (it's in learner/).
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import { COURSE_ROOT, ENGINE_ROOT } from "../server/config.ts";

const bin = (name: string) => path.join(ENGINE_ROOT, "node_modules", ".bin", name);
const course = (p: string) => path.join(COURSE_ROOT, p);

const children: ChildProcess[] = [
  spawn(bin("vite"), ["build", "web", "--watch"], { cwd: ENGINE_ROOT, stdio: "inherit" }),
  spawn(bin("tsx"), [
    "watch", "--clear-screen=false",
    "--include", course("course/**"), "--include", course("tutor/COURSE.md"), "--include", course("tutor/skills/**"),
    "--include", path.join(ENGINE_ROOT, "tutor/SYSTEM.md"), "--include", path.join(ENGINE_ROOT, "tutor/skills/**"),
    path.join(ENGINE_ROOT, "server/index.ts"),
  ], { cwd: COURSE_ROOT, stdio: "inherit", env: { ...process.env, COURSE_ROOT } }),
];

let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const c of children) if (c.exitCode === null) c.kill("SIGTERM");
  setTimeout(() => process.exit(code), 500);
}
for (const c of children) c.on("exit", (code) => stop(code ?? 1));
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
