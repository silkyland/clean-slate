# Direction Interview Guide

The fresh code read (Step 5) tells you where the project IS. This interview
captures where the user wants it to GO. Without it you would rebuild docs
that describe the past instead of pointing at the future.

## Rules

- **ONE question at a time.** Never a wall of questions.
- **Every question carries your recommended answer** with a one-line reason,
  grounded in what you saw in the code (e.g. "Recommended: B — the git log
  shows the team already moving toward the module structure").
- **Five questions maximum.** Stop earlier the moment direction, non-goals,
  and conventions are clear. If the user says "you decide", take your
  recommendation and record it as such in ROADMAP.md.
- Skip any question the salvage pass or the code already answers — asking
  what you already know erodes trust.

## Question bank (pick what applies, in this order)

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
phases and the AGENTS.md ground rules in Step 7.
