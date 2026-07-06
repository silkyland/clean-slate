---
name: clean-slate
description: >-
  Re-initializes a project's agent knowledge from scratch when the existing
  knowledge files (CLAUDE.md, AGENTS.md, cursor rules, architecture docs,
  roadmaps, old plans) have rotted, contradict the code, or accumulated too
  much noise to patch. Salvages still-true facts by verifying them against
  the code, asks the user about backup before deleting anything, re-reads
  the actual codebase fresh, interviews the user on the intended direction,
  and rebuilds strong AGENTS.md, docs/ARCHITECTURE.md, and ROADMAP.md. Use
  when the user asks to reset, re-initialize, or rebuild project knowledge or
  architecture docs, says the docs are stale or wrong, or mentions
  clean-slate or /clean-slate.
license: MIT
argument-hint: "[project-root]"
---

# Clean Slate

Knowledge files rot: plans outlive their implementation, rules contradict the
code, three generations of agents each left their own notes. Past a point,
patching costs more than rebuilding. This skill burns it down **safely** and
rebuilds from the only two sources that matter: **the code as it is, and the
user's intent as they state it today.**

## Safety rules (non-negotiable)

This skill deletes files. Therefore:

1. **Never delete anything before the user has confirmed BOTH the exact file
   list AND a backup decision.** Present the list, ask about backup (with a
   recommended answer), wait for explicit confirmation. No confirmation, no
   deletion.
2. **Never delete human/product documentation** — README, LICENSE, CHANGELOG,
   CONTRIBUTING, API docs for end users. Only agent-knowledge files are in
   scope; see [references/knowledge-file-patterns.md](references/knowledge-file-patterns.md).
   When a file is ambiguous, default to KEEP and ask.
3. **Salvage before you burn.** Old files are read and mined for claims
   before deletion — a rotten document usually still contains a few
   hard-won, still-true facts. Only claims re-verified against the current
   code survive into the new docs.

## Progress checklist

Copy this into your response and check items off:

```
Clean Slate Progress:
- [ ] Step 1: Inventory — list every knowledge file, classify delete/keep/ask
- [ ] Step 2: Salvage — mine old files, verify each claim against current code
- [ ] Step 3: Backup gate — user confirmed file list + backup decision  ⛔ blocking
- [ ] Step 4: Clean — backup executed, in-scope files deleted
- [ ] Step 5: Fresh read — codebase inventoried from source, not from old docs
- [ ] Step 6: Direction interview — user's intent captured, one question at a time
- [ ] Step 7: Rebuild — AGENTS.md, docs/ARCHITECTURE.md, ROADMAP.md written
- [ ] Step 8: Report — deleted / backed up / salvaged / created
```

## Step 1 — Inventory the knowledge files

Scan for agent-knowledge files using the patterns in
[references/knowledge-file-patterns.md](references/knowledge-file-patterns.md).
Present a table: path, what it is, last modified, proposed action
(**delete / keep / ask**). Do not touch anything yet.

## Step 2 — Salvage pass

Read every file marked delete. Extract claims that look load-bearing
(commands, constraints, gotchas, corrections). **Verify each against the
current code** — a claim survives only with a fresh `file:line` citation.
Keep the survivors in a salvage list; let the rest die with the file.

## Step 3 — Backup gate ⛔

Ask the user, ONE question, with a recommended answer:

> These N files will be deleted: <list>. Back them up first?
> **Recommended: yes — archive to `docs/_archive/<YYYY-MM-DD>/` and, if this
> is a git repo, tag the current state (`git tag pre-clean-slate`).**
> Other options: a directory outside the repo, or no backup (git history
> still has them) .

Proceed only after an explicit answer. If the project is not under version
control, treat "no backup" as unavailable — require a backup location.

## Step 4 — Clean

Execute the chosen backup, verify it exists (list the archived files), then
delete the in-scope files. Nothing outside the confirmed list is touched.

## Step 5 — Fresh read of the codebase

Now inventory reality from source, exactly like deep-plan Phase 1: structure,
entry points, wiring, data flow (write AND read path), git trajectory
(~30 commits). Classify components works / half-wired / dead, each with a
proving file path. **Old docs are gone and must not be trusted from memory —
if you recall a "fact" from a deleted file, it counts only if re-verified.**

## Step 6 — Direction interview

The code says where the project IS; only the user knows where it should GO.
Run the interview in [references/interview-guide.md](references/interview-guide.md):
one question at a time, each with your recommended answer based on the fresh
read, ~5 questions maximum. Stop early when direction, non-goals, and
conventions are clear.

## Step 7 — Rebuild strong knowledge

Write the new set using [references/rebuild-templates.md](references/rebuild-templates.md):

- `AGENTS.md` — operating rules + salvaged corrections; under 150 lines.
- `docs/ARCHITECTURE.md` — component map, data flow, constraints — all cited.
- `ROADMAP.md` — the direction from Step 6 as dependency-ordered phases.

If the repo already standardizes on `CLAUDE.md`/`AGENT.md`, write to that
name instead. Every fact carries a citation; everything unverifiable is
omitted — a thin true document beats a thick maybe-true one.

Before presenting, run the **mechanical checks** — commands, not judgment
calls; all must pass:

1. `wc -l AGENTS.md` → **150 or less**; over budget = cut lines until it
   passes, never present-and-apologize.
2. Repo metadata (remotes, hosting, author) must match `git remote -v` /
   git config output exactly — **never construct a GitHub/GitLab URL from
   the repo's name**; no remote = say so.
3. grep your own output for "convention": each needs 2+ citations, else
   relabel as observation.
4. Proportionality: the docs must not dwarf the code they describe.

## Step 8 — Report

- **Deleted:** files removed, with backup location.
- **Salvaged:** claims carried forward (with their new citations).
- **Dropped:** old claims that failed re-verification — one line each; this
  is the evidence the reset was worth it.
- **Created:** the new files.
- **Suggested follow-up:** for the next major feature, run **deep-plan** —
  clean-slate rebuilds what is; deep-plan designs what's next.
