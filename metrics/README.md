# Metrics Snapshots

This directory stores JSON snapshots produced by scheduled jobs or manual scripts. Each file should focus on the dimensions described in `AGENTS.md` (flow, quality, sustainability, coverage) and include timestamps for traceability.

Example filenames:

- `flow-2025-01-10.json`
- `quality-2025-01-10.json`

Keep historical files to preserve trend analysis. Do not commit personally identifiable information or secrets.

Metrics surfaced in the Clarivum Operations Hub overview should map back to these JSON snapshots; update both the automation scripts and `/ops` widgets together.
