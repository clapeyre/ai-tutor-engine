"""Move a learner folder to the course's current numbering, one migration at a time.

    python tools/renumber-learner.py [LEARNER_DIR]     (default: $COURSE_ROOT/learner/)

The migrations are the course's: $COURSE_ROOT/course/renumber.json, oldest first, each
    {"name": "2026-11-18", "lessons": {"6.1": "9.1", ...}, "work": {"07": "06", ...}}
(lesson ids old -> new, and module work folders old -> new). Each leaves a marker file and is skipped once
applied. Rewrites the lesson keys, `current`, margin threads' `from`, "work/NN/" paths and "#/X.Y" lesson
links in progress.json and page.json, and moves the work/NN folders. Backs up both files first. Stop the
server first, and start it after (a running server would write its old state back).
"""
import json
import os
import re
import shutil
import sys
from pathlib import Path

course_root = Path(os.environ.get("COURSE_ROOT") or Path(__file__).resolve().parent.parent / "example")
spec = course_root / "course" / "renumber.json"
MIGRATIONS = [(m["name"], m["lessons"], m["work"]) for m in json.loads(spec.read_text())] if spec.exists() else []
if not MIGRATIONS:
    sys.exit(f"no migrations in {spec}")

d = Path(sys.argv[1] if len(sys.argv) > 1 else course_root / "learner")


def migrate(name: str, lessons: dict, work: dict) -> None:
    backup = d / f"backup-before-renumber-{name}"
    backup.mkdir(exist_ok=True)
    path_rx = re.compile(r"work/(" + "|".join(work) + r")\b")
    link_rx = re.compile(r"#/(" + "|".join(re.escape(k) for k in lessons) + r")\b")
    for fname in ("progress.json", "page.json"):
        p = d / fname
        if not p.exists():
            continue
        shutil.copy2(p, backup / fname)
        data = json.loads(p.read_text())
        if isinstance(data.get("lessons"), dict):
            data["lessons"] = {lessons.get(k, k): v for k, v in data["lessons"].items()}
        if data.get("current") in lessons:
            data["current"] = lessons[data["current"]]
        for t in data.get("threads", []) or []:
            if t.get("from") in lessons:
                t["from"] = lessons[t["from"]]
        text = json.dumps(data, ensure_ascii=False, indent=1 if fname == "page.json" else 2)
        if work:
            text = path_rx.sub(lambda m: "work/" + work[m.group(1)], text)  # one pass: a cycle maps cleanly
        text = link_rx.sub(lambda m: "#/" + lessons[m.group(1)], text)
        p.write_text(text)
        print(f"{p}: renumbered ({name}); current = {data.get('current')}; backup in {backup}")
    tmp = {k: d / f"work/.renumber-{k}" for k in work if (d / "work" / k).exists()}
    for k, t in tmp.items():
        (d / "work" / k).rename(t)
    for k, t in tmp.items():
        if (d / "work" / work[k]).exists():
            sys.exit(f"{d}/work/{work[k]} already exists; {t} left in place")
        t.rename(d / "work" / work[k])
        print(f"moved {d}/work/{k} to {d}/work/{work[k]}")
    (d / f".renumbered-{name}").write_text(f"renumbered by tools/renumber-learner.py ({name})\n")


done = 0
for name, lessons, work in MIGRATIONS:
    if (d / f".renumbered-{name}").exists():
        continue
    migrate(name, lessons, work)
    done += 1
print(f"{done} migration(s) applied" if done else f"{d} is already on the current numbering; nothing done")
