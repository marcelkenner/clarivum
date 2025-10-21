# Backlog Tasks · AGENTS Guide

The backlog is the intake queue for ideas that need refinement before they can be scheduled. Use it for discovery, spike proposals, or initiatives pending Definition of Ready.

## Scope
- Capture problems, hypotheses, or research tasks that still need stakeholder alignment or effort sizing.
- Record context from PRDs/ADRs and required Context7 lookups so future refinement is fast.
- Avoid parking half-written implementation tasks; move those to `ready/` once DoR is satisfied.

## Authoring Checklist
- Use the `<prefix>-<sequence>-<slug>.md` naming format and keep metadata current.
- Populate `## Summary`, `## Definition of Ready`, and `## Follow-ups` with known unknowns or open questions.
- Call out dependencies (design, data, tooling) and link to owners or Slack channels for follow-up.
- When refinement resolves all open items, update `status`, adjust the checklists, and relocate the file.

## Grooming Rhythm
- Review this column during weekly planning; archive stale ideas or push them toward readiness.
- Prefer concise notes with clear next steps over detailed specs until stakeholders commit.
- If an item transitions directly into delivery, ensure the receiving lane revalidates DoR and context.
