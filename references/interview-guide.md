# Direction Interview Guide

The fresh code read (Step 5) tells you where the project IS. This interview
captures where the user wants it to GO. Without it you would rebuild docs
that describe the past instead of pointing at the future.

## Rules

- **Ask only what changes the outcome.** If the code, the salvage pass, or
  the invocation already answers a question, state the answer as an
  assumption the user can override — do not spend a question on it.
- **Every question carries your recommended answer** with a one-line reason,
  grounded in what you saw in the code (e.g. "Recommended: B — the git log
  shows the team already moving toward the module structure").
- **Five questions maximum.** Stop earlier the moment direction, non-goals,
  and conventions are clear. If the user says "you decide", take your
  recommendation and record it as such in ROADMAP.md.
- **One question at a time by default** — never a wall of unstructured
  questions. When the host offers a structured question tool and the
  remaining questions do not depend on each other's answers, batch them in
  one call; each still carries its recommended answer.
- Skip any question the salvage pass, the code, or the invocation already
  answers — asking what you already know erodes trust.

## Question bank (pick what applies, in this order)

0. **Salvage confirmations** — the Step 2 claims tagged
   UNVERIFIABLE-FROM-CODE. Batch related ones into a single question
   ("The old docs claimed: deploys are manual via <X>; PRs need two
   reviews. Still true? Recommended: yes — nothing in the code contradicts
   them"). These outrank the generic questions below: confirming a
   hard-won old fact is worth more than a fresh guess. Whatever the
   five-question budget cannot cover goes to ROADMAP.md **Open questions**
   — never silently dropped.

1. **Purpose check** — "The code suggests this project is <X for Y>. Is that
   still the goal, or has it shifted?" — anchors everything else.
2. **Direction** — "For the next phase, which matters most: <A: stabilize
   what exists / B: the half-built <feature> I found / C: something new>?"
   — base A/B/C on the half-wired components and git trajectory you found.
3. **Architecture verdict** — "Keep the current <pattern/stack> or is a
   migration intended?" — only ask if the code shows tension (mixed
   patterns, abandoned refactor).
4. **Non-goals** — "Anything I should explicitly mark out of scope so future
   agents stop drifting there?" — the highest-value line in AGENTS.md.
5. **Conventions** — "Any rules of the house not visible in the code
   (deployment quirks, review rules, forbidden dependencies)?" — captures
   knowledge that lives only in the user's head.

## Output

Condense the answers into a short **Direction Brief** (5–10 lines: goal,
next-phase priority, architecture verdict, non-goals, house rules). Show it
to the user for a yes/no confirmation, then use it to drive the ROADMAP.md
phases and the AGENTS.md ground rules in Step 7. Record the brief, its
confirmation status, and the count of `UNCONFIRMED` lines in
`.clean-slate/state.md`.

Headless (no user), or the user waived questions entirely ("just do it"):
do not invent answers. Derive the brief from the git trajectory and
half-wired components, mark every line `UNCONFIRMED (headless)` — or
`UNCONFIRMED` when a user was present but declined to answer — and copy
each such line into ROADMAP.md **Open questions** for the next attended
session.
