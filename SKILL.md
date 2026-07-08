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
4. **Deletion without a verified backup is ONE-WAY** — it requires an
   explicit user confirmation and is never performed unattended. Deletion
   after a count-verified backup (Step 4) is REVERSIBLE and is the only
   kind this skill executes in a headless run.

## Headless mode (no user available)

If nobody can answer the gates (CI, another agent driving this skill),
degrade honestly instead of inventing answers:

- **Step 3 (backup gate):** take the recommended backup unprompted —
  archive to `docs/_archive/<YYYY-MM-DD>/` plus `git tag pre-clean-slate` —
  and run Step 4's count check. A verified backup is the ONLY thing that
  unlocks deletion; if the backup cannot be executed or the counts do not
  match, **stop before deleting anything** and report which check failed.
- **Step 6 (interview):** skip the questions; derive the Direction Brief
  from the git trajectory and the half-wired components, and mark every
  derived line `UNCONFIRMED (headless)`. Each such line also lands in
  ROADMAP.md under **Open questions** so the next attended session can
  confirm it.

## Progress checklist

Copy this into your response and check items off:

```
Clean Slate Progress:
- [ ] Step 1: Inventory — every knowledge file classified delete/keep/ask, CI-reference gate run
- [ ] Step 2: Salvage — every mined claim tagged VERIFIED / REFUTED / UNVERIFIABLE-FROM-CODE
- [ ] Step 3: Backup gate — user confirmed file list + backup decision (headless: recommended backup taken)  ⛔ blocking
- [ ] Step 4: Clean — backup count-verified against the delete list, in-scope files deleted
- [ ] Step 5: Fresh read — codebase inventoried from source, not from old docs
- [ ] Step 6: Direction interview — Direction Brief confirmed (headless: derived + UNCONFIRMED)
- [ ] Step 7: Rebuild — AGENTS.md, docs/ARCHITECTURE.md, ROADMAP.md written; mechanical checks pass
- [ ] Step 8: Report — deleted / backed up / salvaged / dropped / created + rot cause named
```

## Step 1 — Inventory the knowledge files

Scan for agent-knowledge files using the patterns in
[references/knowledge-file-patterns.md](references/knowledge-file-patterns.md).
Before presenting anything, run the **CI-reference gate** (exact command in
that reference) for every delete candidate — any file referenced by a
build/CI/docs-site config is reclassified **KEEP**, no judgment call.
Then present a table: path, what it is, last modified, proposed action
(**delete / keep / ask**). Do not touch anything yet.

## Step 2 — Salvage pass

Read every file marked delete. Extract claims that look load-bearing
(commands, constraints, gotchas, corrections). Tag **every** mined claim
exactly one of:

- **VERIFIED** — re-checked against the current code, fresh `file:line`
  citation attached. Survives into the new docs.
- **REFUTED** — the code disproves it. Dies with the file, but the
  correction is gold: it feeds `Common wrong assumptions` in AGENTS.md.
- **UNVERIFIABLE-FROM-CODE** — nothing in the repo can prove or disprove it
  (deploy quirks, review rules, "never upgrade X"). These are often the
  hardest-won facts in the old docs — **never drop one silently.** Each
  becomes a named confirmation item for the Step 6 interview; any that the
  question budget cannot cover land in ROADMAP.md **Open questions**.

Untagged claims are a checklist failure: the tag count must equal the
mined-claim count.

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

Execute the chosen backup, then run the **count check** — a command, not a
judgment call: the number of files in the archive must equal the number of
files on the confirmed delete list (e.g. `find docs/_archive/<date> -type f | wc -l`
vs the list length), and the git tag must show up in `git tag -l`. Counts
match → delete the in-scope files. Counts differ → stop and fix the backup;
**no deletion on a failed count check.** Nothing outside the confirmed list
is touched.

## Step 5 — Fresh read of the codebase

Now inventory reality from source, exactly like deep-plan Phase 1: structure,
entry points, wiring, data flow (write AND read path), git trajectory
(~30 commits), and operational reality (deploy config, environments,
background jobs — the knowledge that rots fastest). Classify components
works / half-wired / dead, each with a proving file path. **Old docs are gone and must not be trusted from memory —
if you recall a "fact" from a deleted file, it counts only if re-verified.**

## Step 6 — Direction interview

The code says where the project IS; only the user knows where it should GO.
Run the interview in [references/interview-guide.md](references/interview-guide.md):
one question at a time, each with your recommended answer based on the fresh
read, ~5 questions maximum. Fold the Step 2 **UNVERIFIABLE-FROM-CODE**
claims into it — confirming a hard-won old fact beats asking a generic
question. Stop early when direction, non-goals, and conventions are clear.

The interview ends with the **Direction Brief gate**: a 5–10 line brief in
chat (goal, next-phase priority, architecture verdict, non-goals, house
rules) with ONE yes/no confirmation — this is the cheap moment to change
course; after Step 7 it costs a rewrite. Headless: derive the brief from
the code evidence and mark every line `UNCONFIRMED (headless)`.

## Step 7 — Rebuild strong knowledge

Write the new set using [references/rebuild-templates.md](references/rebuild-templates.md):

- `AGENTS.md` — operating rules + salvaged corrections; under 150 lines.
- `docs/ARCHITECTURE.md` — component map, data flow, constraints — all cited.
- `ROADMAP.md` — the direction from Step 6 as dependency-ordered phases.

If the repo already standardizes on `CLAUDE.md`/`AGENT.md`, write to that
name instead. Every fact carries a citation; everything unverifiable is
omitted — a thin true document beats a thick maybe-true one.

Before writing, run a one-line **rot pre-mortem**: "these new docs rotted
again three months from now — why?" Name the most likely cause from the
evidence you already have (plans written but never ingested, agents
appending instead of editing, a doc nobody's workflow touches) and write
ONE ground rule in AGENTS.md that counters that specific cause. A generic
cause ("docs got stale") that fits any repo is a failure — cite what
actually rotted in THIS repo.

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
5. Salvage accountability: every Step 2 claim tagged UNVERIFIABLE-FROM-CODE
   appears either in the confirmed Direction Brief or in ROADMAP.md
   **Open questions** — grep for each; a silently dropped claim = failure.
6. AGENTS.md contains the anti-rot ground rule from the pre-mortem, and it
   names this repo's observed rot cause — grep for it.

## Step 8 — Report

- **Deleted:** files removed, with backup location.
- **Salvaged:** claims carried forward (with their new citations).
- **Dropped:** old claims that failed re-verification — one line each; this
  is the evidence the reset was worth it.
- **Carried open:** UNVERIFIABLE-FROM-CODE claims awaiting confirmation,
  and any `UNCONFIRMED (headless)` direction lines — where they now live.
- **Rot cause:** the one-line diagnosis of why the old docs rotted, and
  the AGENTS.md rule now countering it.
- **Created:** the new files.
- **Suggested follow-up:** for the next major feature, run **deep-plan** —
  clean-slate rebuilds what is; deep-plan designs what's next.
