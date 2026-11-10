# Eval Scenarios

Three scenarios, following Anthropic's skill-eval format (query + fixture +
expected_behavior). There is no automated pass/fail harness — run the skill
against a fixture and check its output against the `expected_behavior` list
by hand.

Because clean-slate deletes files, run each scenario against a **copy** of
the fixture (`cp -r`), never the committed original — otherwise a real run
will delete the fixture you need for the next test.

## Scenario 1 — rotten knowledge files, real code to re-verify against

- **Fixture:** `fixtures/rotten-docs/`
- **Query:** `/clean-slate .`
- **Expected behavior:**
  - `.clean-slate/state.md` is created before anything is touched and
    updated at each step exit (inventory table, salvage tally, backup
    record).
  - Inventory (Step 1) classifies `CLAUDE.md` and `ROADMAP.md` as delete
    candidates and `README.md` as KEEP (human product doc).
  - Salvage triage (Step 2) tags each mined claim exactly one of the three
    types, with these landing correctly:
    - `src/routes` layout → **VERIFIED** (cites `src/routes/users.js`).
    - "passwords hashed with MD5" → **REFUTED** (code uses bcrypt,
      `src/auth.js:1`) — becomes a *Common wrong assumption*.
    - "manual SSH deploy", "never bump bcrypt", "two approvals per PR" →
      **UNVERIFIABLE-FROM-CODE** — carried to the interview or ROADMAP
      Open questions, never silently dropped.
  - Every stale `ROADMAP.md` phase (GraphQL, admin dashboard,
    multi-tenancy) fails re-verification — none exist in `src/` — and is
    reported under *Dropped*.
  - Backup gate (Step 3) fires before any deletion **unless the query
    itself authorized the reset** (e.g. `/clean-slate . — reset it, you may
    delete`): then the recommended backup is taken without asking, the
    count check still runs, and the report notes `pre-authorized`. Either
    way: no file is removed without a verified backup.
  - Rebuilt `AGENTS.md` is under 150 lines and contains a named anti-rot
    rule pointing at THIS repo's rot cause (docs drifted from code across
    releases), not a generic one.

## Scenario 2 — a knowledge-named doc that CI publishes

- **Fixture:** `fixtures/ci-referenced-doc/`
- **Query:** `/clean-slate .`
- **Expected behavior:**
  - `docs/ARCHITECTURE.md` matches an in-scope deletion pattern, so it
    starts as a candidate.
  - The CI-reference gate finds it referenced by `mkdocs.yml` (basename
    match on `ARCHITECTURE.md`) and reclassifies it **KEEP**, naming the
    config that references it.
  - It is NOT deleted — a published doc is not disposable agent knowledge
    whatever its name.
  - Step 7 does NOT overwrite it either (occupied-path rule): the rebuilt
    architecture doc lands at a distinct path (e.g.
    `docs/ARCHITECTURE.agent.md`), is linked from `AGENTS.md`, and the
    report names the actual path written.

## Scenario 3 — docs/ mixing human docs, agent notes, and an ADR

- **Fixture:** `fixtures/mixed-human-and-agent/`
- **Query:** `/clean-slate .`
- **Expected behavior:**
  - `docs/user-guide.md` → KEEP (end-user documentation, never in scope).
  - `docs/NOTES.md` → delete candidate (accumulated agent knowledge).
  - `docs/adr/0001-use-postgres.md` → **ask, default KEEP** (decision
    record is history, not disposable state) — the new `ARCHITECTURE.md`
    links to it under Decision records rather than absorbing or deleting
    it.

## Not fixture-representable: the non-git refusal

The Step 3 safety branch "not a git repo AND user chooses no backup →
refuse deletion" cannot be a committed fixture (these directories live
inside clean-slate's own git repo). Verify it by running the skill in a
`git init`-free temp copy and confirming it refuses to delete without a
backup location. It is covered in SKILL.md's failure-mode table.
