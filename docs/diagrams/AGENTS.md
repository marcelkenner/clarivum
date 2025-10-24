# Diagrams · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
This directory stores the canonical diagrams that accompany Clarivum features and decisions. Keep it tidy so reviewers and operators can trace system changes quickly.

## Structure

- Create one subdirectory per feature or ADR using kebab-case (for example, `diagnostics-platform`).
- Inside each folder, include:
  - `README.md` summarizing what the diagrams cover, owners, and last update date.
  - Mermaid/PlantUML source files (`*.md`, `*.mmd`, `*.puml`) and any exported assets (`*.svg`, `*.png`).
  - Links back to the governing ADR and task IDs.
- Never let any single Markdown file exceed 500 lines—split large diagrams across multiple files.

## Contribution checklist

- Confirm diagrams observe the requirements in `docs/policies/diagramming-policy.md`.
- Validate Mermaid syntax locally (Mermaid CLI or the VS Code extension) before committing.
- Commit both source and exported assets when using graphical tools.
- Update references in PR descriptions, ADRs, and runbooks so consumers can find the diagrams.
- Run `npm run lint:diagrams` to confirm files are discoverable and linked from ADRs.

If new diagram types or tooling emerge, extend this guide and notify the architecture lead.
