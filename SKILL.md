---
name: clean-slate
description: >-
  Re-initializes a project's agent knowledge from scratch when the existing
  knowledge files (CLAUDE.md, AGENTS.md, cursor rules, architecture docs,
  roadmaps, old plans) have rotted, contradict the code, or accumulated too
  much noise to patch. Mines the old docs for claims and tags each one
  against the actual code, takes a count-verified backup, deletes only the
  confirmed agent-knowledge files — never human docs, code, or files that a
  build/CI/docs-site config references — then re-reads the codebase fresh,
  interviews the user on direction, and rebuilds strong AGENTS.md,
  docs/ARCHITECTURE.md, and ROADMAP.md. Resumable via .clean-slate/state.md.
  Use when the user asks to reset, re-initialize, or rebuild project
  knowledge or architecture docs, says the docs are stale or wrong, or
  mentions clean-slate or /clean-slate.
license: MIT
argument-hint: "[project-root]"
---

# Clean Slate

Knowledge files rot: plans outlive their implementation, rules contradict the
code, three generations of agents each left their own notes. Past a point,
patching costs more than rebuilding. This skill burns it down **safely** and
rebuilds from the only two sources that matter: **the code as it is, and the
user's intent as they state it today.**

## What may be deleted — and what never is

Only **agent-knowledge files** are deletion candidates: the instruction files
agents load (`CLAUDE.md`, `AGENTS.md`, cursor rules, …) and the accumulated
knowledge docs (architecture docs, roadmaps, old plans, agent notes). The
patterns and detection commands live in
[references/knowledge-file-patterns.md](references/knowledge-file-patterns.md).

Never candidates, whatever the name: **human documentation** (README,
LICENSE, user guides, ADRs — history, not state), **code, tests, and
configs**, **anything a build/CI/docs-site config references** (the Step 1
gate enforces this mechanically), and **anything outside the project
root**. A pattern-matching file that is ambiguous — touched within the
last 7 days, human-flavored, referenced by a kept doc — is classed **ask**
and defaults to KEEP. When in doubt: KEEP and ask.

## Evidence tags

Every claim about the repo — mined from the old docs in Step 2, found in
the fresh read in Step 5 — carries exactly one tag or it does not get
written down:

| Tag | Meaning | Carries |
|-----|---------|---------|
| VERIFIED | Re-checked against the current code yourself | A fresh `file:line` — never copied from the old doc |
| REFUTED | The code disproves it | The corrected fact + `file:line`; feeds *Common wrong assumptions* |
| UNVERIFIABLE-FROM-CODE | Nothing in the repo can prove or disprove it | What was tried; becomes an interview item or a ROADMAP Open question |

REFUTED is this skill's CORRECTED and UNVERIFIABLE-FROM-CODE its
UNVERIFIED: the old belief is dead or cannot be checked, and the tag keeps
it from being laundered into the new docs as fact. In the rebuilt files,
only VERIFIED facts appear as facts; direction and house rules are
**user-attested** — cite the interview and date, not a `file:line` they do
not have; everything else lives in ROADMAP.md **Open questions**.

## Safety rules (non-negotiable)

This skill deletes files. Therefore:

1. **Never delete anything without BOTH authorization and a verified
   backup.** Authorization is explicit confirmation at the Step 3 gate —
   or authorization the invocation already gave ("reset it", "you may
   delete", "clean slate this repo"), which answers the gate in advance:
   do not ask again, take the recommended backup, verify the counts,
   proceed. "The docs look stale" is a complaint, not permission; when in
   doubt, ask. And no backup, no deletion — headless or not.
2. **Never delete anything outside the confirmed delete list.** Files
   classed keep or ask are untouchable; ask defaults to KEEP.
3. **Salvage before you burn.** Old files are read and mined for claims
   before deletion — a rotten document usually still contains a few
   hard-won, still-true facts. Only claims re-verified against the current
   code survive into the new docs.
4. **Deletion without a verified backup is ONE-WAY** — it requires an
   explicit user confirmation and is never performed unattended. Deletion
   after a count-verified backup (Step 4) is REVERSIBLE and is the only
   kind this skill executes in a headless run or under pre-authorization.

## Headless mode (no user available)

If nobody can answer the gates (CI, another agent driving this skill),
degrade honestly instead of inventing answers:

- **Step 3 (backup gate):** take the recommended backup unprompted —
  archive to `docs/_archive/<YYYY-MM-DD>/` plus `git tag pre-clean-slate` —
  and run Step 4's count check. A verified backup is the ONLY thing that
  unlocks deletion; if it cannot be executed or the counts do not match,
  **stop before deleting anything** and report which check failed.
- **Step 6 (interview):** skip the questions; derive the Direction Brief
  from the git trajectory and the half-wired components, mark every
  derived line `UNCONFIRMED (headless)`, and copy each into ROADMAP.md
  **Open questions** for the next attended session.

## Asking the user

Three moments ask: the backup gate (Step 3), the interview (Step 6), and
the Direction Brief confirmation. For all of them: ask only what changes
the outcome (the repo, the salvage pass, or the invocation already answers
the rest — state those as overridable assumptions); every question carries
a recommended answer with a one-line reason; one question at a time by
default, batched in one call only when the questions are independent and
the host offers a structured question tool; never re-ask what was already
answered — including the delete gate itself when pre-authorized.

## Progress checklist

Copy this into your response and check items off:

```
Clean Slate Progress:
- [ ] Before Step 1: target root resolved; .clean-slate/state.md created — or an existing one resumed from
- [ ] Step 1: Inventory — every knowledge file classified delete/keep/ask, CI-reference gate run
- [ ] Step 2: Salvage — every mined claim tagged VERIFIED / REFUTED / UNVERIFIABLE-FROM-CODE
- [ ] Step 3: Backup gate — authorization recorded (pre-given or confirmed) + backup decision made  ⛔ blocking
- [ ] Step 4: Clean — backup count-verified against the delete list, in-scope files deleted
- [ ] Step 5: Fresh read — codebase inventoried from source, not from old docs
- [ ] Step 6: Direction interview — Direction Brief confirmed (headless: derived + UNCONFIRMED)
- [ ] Step 7: Rebuild — AGENTS.md, docs/ARCHITECTURE.md, ROADMAP.md written or merged; mechanical checks pass
- [ ] Step 8: Report — deleted / backed up / salvaged / dropped / created + rot cause named
```

## Before Step 1

1. **Target root.** If a `[project-root]` argument was given, that path is
   the repo root for every step below — including the deletion scope,
   which must never reach outside it; otherwise use the current working
   directory. State which one you used in the final report.
2. **Resume check.** Look for `<root>/.clean-slate/state.md`. If it exists,
   follow "Resuming" in [references/state-file.md](references/state-file.md)
   instead of starting over — gates already satisfied are not re-asked.
3. **State file.** Create `.clean-slate/state.md` from
   [references/state-file.md](references/state-file.md) before touching
   anything, and update it at each step exit. It is working memory: never
   committed, never a deletion candidate.

**Sizing.** Scale the effort to what Step 1 finds, not to the repo's size:
a few rotten files in a small repo is a single pass; many knowledge files
or a large codebase earns parallel salvage readers (one per file or
file-group, each returning the tagged-claim table) and a fresh read split
by area. When two options fit, take the lighter one — the gates matter
more than the parallelism. No subagent support: do it yourself, same
result, slower.

## Step 1 — Inventory the knowledge files

Scan for agent-knowledge files using the patterns in
[references/knowledge-file-patterns.md](references/knowledge-file-patterns.md).
Before presenting anything, run the **CI-reference gate** (exact command in
that reference) for every delete candidate — any file referenced by a
build/CI/docs-site config is reclassified **KEEP**, no judgment call.
Then present a table: path, what it is, last modified, proposed action
(**delete / keep / ask**). Do not touch anything yet. Record the full
classification in the state file — a resumed session must not re-derive it.

## Step 2 — Salvage pass

Read every file marked delete. Extract claims that look load-bearing
(commands, constraints, gotchas, corrections) and tag each one per
"Evidence tags". Two consequences to enforce:

- **REFUTED** claims feed *Common wrong assumptions* in the rebuilt
  AGENTS.md — the correction is the salvage.
- **UNVERIFIABLE-FROM-CODE** claims are never dropped silently: each
  becomes a named confirmation item for the Step 6 interview, and whatever
  the question budget cannot cover lands in ROADMAP.md **Open questions**.

Untagged claims are a checklist failure: the tag count must equal the
mined-claim count. Record the tally in the state file.

## Step 3 — Backup gate ⛔

**If the invocation already authorized the reset** — "reset it", "clean
slate", "you may delete", "wipe the old docs" — the gate is answered.
Record `auth: pre-authorized` in the state file, take the recommended
backup below, and proceed to Step 4 without asking. Pre-authorization
covers files classed **delete**; anything classed **ask** still defaults
to KEEP unless the user says otherwise.

**If nobody can answer** (CI, another agent driving this skill), see
Headless mode — same mechanics: recommended backup, count check, stop on
failure. **Otherwise ask the user, ONE question, with a recommended
answer:**

> These N files will be deleted: <list>. Back them up first?
> **Recommended: yes — archive to `docs/_archive/<YYYY-MM-DD>/` and, if this
> is a git repo, tag the current state (`git tag pre-clean-slate`).**
> Other options: a directory outside the repo, or no backup (git history
> still has them).

Proceed only after an explicit answer or recorded pre-authorization. **If
the project is not under version control, treat "no backup" as
unavailable** — require a backup location; deletion without backup and
without git history is irreversible.

## Step 4 — Clean

Execute the chosen backup, then run the **count check** — a command, not a
judgment call: the number of files in the archive must equal the number of
files on the confirmed delete list (e.g. `find docs/_archive/<date> -type f | wc -l`
vs the list length), and the git tag must show up in `git tag -l`. Counts
match → delete the in-scope files. Counts differ → stop and fix the backup;
**no deletion on a failed count check.** Nothing outside the confirmed list
is touched. Record the backup location and count result in the state file.

## Step 5 — Fresh read of the codebase

Now inventory reality from source, exactly like deep-plan Phase 1: structure,
entry points, wiring, data flow (write AND read path), git trajectory
(~30 commits), and operational reality (deploy config, environments,
background jobs — the knowledge that rots fastest). Classify components
works / half-wired / dead, each with a proving file path — a suspicion you
have not opened is UNVERIFIED, not a finding. **Old docs are gone and must
not be trusted from memory — if you recall a "fact" from a deleted file,
it counts only if re-verified.**

## Step 6 — Direction interview

The code says where the project IS; only the user knows where it should GO —
and this skill never invents direction from guesses. Run the interview in
[references/interview-guide.md](references/interview-guide.md): ~5 questions
maximum, each with your recommended answer based on the fresh read. Fold
the Step 2 **UNVERIFIABLE-FROM-CODE** claims into it — confirming a hard-won
old fact beats asking a generic question. Skip anything the code, the
salvage pass, or the invocation already answered. Stop early when direction,
non-goals, and conventions are clear.

The interview ends with the **Direction Brief gate**: a 5–10 line brief in
chat (goal, next-phase priority, architecture verdict, non-goals, house
rules) with ONE yes/no confirmation — the cheap moment to change course;
after Step 7 it costs a rewrite. If the user has signaled "just do it"
throughout, present the brief in the final report instead and mark
unconfirmed lines `UNCONFIRMED`. Headless: derive the brief from the code
evidence and mark every line `UNCONFIRMED (headless)`.

## Step 7 — Rebuild strong knowledge

Write the new set using [references/rebuild-templates.md](references/rebuild-templates.md):

- `AGENTS.md` — operating rules + salvaged corrections; under 150 lines.
- `docs/ARCHITECTURE.md` — component map, data flow, constraints — all cited.
- `ROADMAP.md` — the direction from Step 6 as dependency-ordered phases.

If the repo already standardizes on `CLAUDE.md`/`AGENT.md`, write to that
name instead — never create a second competing instructions file.

**Occupied-path rule.** If a canonical path already holds a file this run
did not delete, never overwrite it blindly: occupant is agent knowledge →
merge section-by-section (the deep-plan-ingest policy — refresh owned
sections, leave human prose, append under a marked section when ownership
is unclear); occupant is a human or CI-published doc (the Step 1 KEEP case)
→ write the rebuilt doc to a distinct path (`docs/ARCHITECTURE.agent.md`,
`ROADMAP.agent.md`) and link it from AGENTS.md. The published file is never
touched.

Every fact carries a citation or is marked user-attested; everything
unverifiable is omitted — a thin true document beats a thick maybe-true
one.

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
7. Evidence audit: every factual claim in the new docs carries a citation
   or is marked user-attested/<date> — spot-grep for uncited assertions.

## Step 8 — Report

- **Deleted:** files removed, with backup location.
- **Salvaged:** claims carried forward (with their new citations).
- **Dropped:** old claims that failed re-verification — one line each; this
  is the evidence the reset was worth it.
- **Carried open:** UNVERIFIABLE-FROM-CODE claims awaiting confirmation,
  and any `UNCONFIRMED` / `UNCONFIRMED (headless)` direction lines — where
  they now live.
- **Rot cause:** the one-line diagnosis of why the old docs rotted, and
  the AGENTS.md rule now countering it.
- **Created:** the new files — actual paths written, including any
  `.agent.md` variants or merges, plus the state file location.
- **Authorization:** how the delete gate was satisfied (pre-authorized /
  confirmed at gate / headless recommended backup).
- **Follow-up:** for the next major feature, run **deep-plan** — clean-slate
  rebuilds what is; deep-plan designs what's next.

## When things go wrong

| Situation | Response |
|-----------|----------|
| Backup count check fails (Step 4) | Stop before deleting anything; fix the backup until counts match — never proceed on a failed count check |
| Not a git repo and user chooses "no backup" | Refuse; require an explicit backup location — deletion without backup or git is irreversible |
| User unavailable at backup gate (headless) | Take recommended backup (archive + git tag if available); verify counts; stop if backup fails — never delete unattended without verified backup |
| Run interrupted mid-skill | Resume from `.clean-slate/state.md` per references/state-file.md — re-verify backup counts before deleting anything remaining; never re-ask a satisfied gate |
| Rebuild target path occupied by a kept file | Merge if agent knowledge; write a `.agent.md` variant if human/CI-published — never overwrite (Step 7) |
| Fresh read finds the repo empty or trivial | Complete with minimal docs; note in report that the knowledge set reflects the current minimal state |
| Interview reveals the project is abandoned | Write docs reflecting current state; mark direction `UNCONFIRMED (abandoned)` in ROADMAP.md; suggest archival in report |
