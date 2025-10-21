# Task Board Overview

Tasks live under status subdirectories, each of which contains discipline lanes:

```
tasks/
  backlog/
    backend/
    business/
    frontend/
    platform/
    qa/
    shared/
  ready/
    …
  in-progress/
    …
  blocked/
    …
  done/
    …
```

Each task is a Markdown file named `<prefix>-<sequence>-<slug>.md` (e.g., `fe-001-bootstrap-vitest.md`). Prefixes hint at discipline (`fe`, `be`, `plat`, `qa`, `biz`, `ops`, `shared`). See `tasks/AGENTS.md` for the full authoring checklist.
