# Rebuild Templates

Structures for the three files Step 7 creates. Same philosophy as the
deep-plan skill family: every fact carries a citation (`file:line` or
versioned doc URL); anything unverifiable is omitted. **A thin true document
beats a thick maybe-true one** — these files start minimal and grow only
with evidence.

Evidence discipline: a factual claim enters AGENTS.md or
ARCHITECTURE.md only as **VERIFIED** (fresh `file:line` attached) or as
**user-attested** direction/house rules (cite "user interview, <date>").
UNVERIFIABLE-FROM-CODE salvage claims and UNVERIFIED fresh-read findings
never appear as facts — they live in ROADMAP.md **Open questions** until a
user or the code confirms them.

## Contents

- [AGENTS.md — hard budget: under 150 lines](#agentsmd--hard-budget-under-150-lines)
- [docs/ARCHITECTURE.md](#docsarchitecturemd)
- [ROADMAP.md](#roadmapmd)

## AGENTS.md — hard budget: under 150 lines

Loaded every session; every line must change agent behavior.

```markdown
# AGENTS.md

<One paragraph: what this system is, and its non-goals — from the Direction Brief.>

## Ground rules

<House rules from the interview + constraints proven by the code. Each with a why.>
- Never <X> — <consequence> (`file:line` if from code).
- Always <Y> before <Z>.
- <Anti-rot rule from the Step 7 pre-mortem — counters THIS repo's observed
  rot cause, e.g. "After every accepted plan, run deep-plan-ingest — the
  old docs rotted because 3 plans shipped without ever landing here.">


## Common wrong assumptions

<THE salvage showcase: old-doc claims that failed re-verification, plus
gotchas discovered during the fresh read. This section is why the reset
happened — make it earn its lines.>
- <Plausible-but-wrong belief>: actually <corrected fact> (`file:line`).

## Commands

<Verified by running them, or marked with the file that defines them.>
- Build / test / lint: `<command>`

## Where knowledge lives

- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Direction and phases: [ROADMAP.md](ROADMAP.md)
```

Merge note: if the repo standardizes on `CLAUDE.md` or `AGENT.md`, write to
that name instead — never create a second competing instructions file. If a
canonical path was occupied by a kept file, follow the occupied-path rule
in SKILL.md Step 7: merge into agent-knowledge occupants, write
`<name>.agent.md` variants for human/CI-published ones, and link the actual
paths here.

## docs/ARCHITECTURE.md

(Canonical path — write to `docs/ARCHITECTURE.agent.md` instead when the
canonical path is occupied by a kept human/CI-published doc; see the
occupied-path rule in SKILL.md Step 7.)

```markdown
# Architecture

> Rebuilt from source by clean-slate on <date>. Facts carry citations —
> a citation that no longer matches the code means the fact is stale.

## System overview

<5–10 lines + a diagram if topology is non-obvious. From the fresh read,
not from memory of the deleted docs.>

## Components

| Component | Responsibility | Status | Evidence |
|-----------|----------------|--------|----------|
| `src/...` | <one line> | works / half-wired / dead | `file:line` |

## Data flow

<Write path AND read path as numbered steps, each naming its file/class.>

## Constraints and sharp edges

<Load-bearing quirks with citations — salvaged survivors land here too.>

## Decision records

### 1. <Reset baseline> (<date>)
- **Decision:** knowledge rebuilt from source via clean-slate; prior docs archived at <backup location>.
- **Why:** <one line — e.g. docs contradicted code in N places>.

<Link any kept ADRs/decision records here (e.g. `adr/0001-use-postgres.md`)
rather than absorbing or deleting them — they are history this doc points
to.>

<Append-only from here. New decisions get new numbers.>
```

## ROADMAP.md

```markdown
# Roadmap

> Direction set with the user on <date> (clean-slate interview). Detail per
> phase gets added by deep-plan runs as each phase is planned.

## Direction Brief

<The confirmed 5–10 line brief: goal, priority, architecture verdict,
non-goals, house rules.>

## Status

| Phase | Name | Status | Depends on |
|-------|------|--------|------------|
| 0 | <stabilize: fix broken basics found in the fresh read> | todo | — |
| 1 | <the user's chosen priority> | todo | 0 |

## Phase details

### Phase <N>: <name> — todo
- **Objective:** <one line>
- **Exit criteria:** <verifiable>
- **Tasks:**
  - [ ] <concrete, naming files — or "run deep-plan for this phase" if it
        needs real research before tasks can be honest>

## Open questions

- [ ] <anything the interview left unresolved — with what would resolve it>
- [ ] <UNVERIFIABLE-FROM-CODE salvage claims the question budget missed —
      quoted, with their old source noted>
- [ ] <every `UNCONFIRMED` / `UNCONFIRMED (headless)` Direction Brief line —
      first attended session confirms or drops them>
```

Status vocabulary: `done` / `in-progress` / `blocked` / `todo` / `dropped` —
same as the deep-plan family, so the files stay compatible if both skills
are used on one project.
