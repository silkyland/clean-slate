# Evals

Manual test scenarios for `/clean-slate`, per Anthropic's guidance to build
evaluations before writing extensive documentation. There is no automated
harness — run each scenario against its fixture and check the result against
[scenarios.md](scenarios.md).

**Run against a copy, not the original.** clean-slate deletes files; a real
run against a committed fixture would destroy it. Always:

```bash
cp -r evals/fixtures/rotten-docs /tmp/cs-eval && cd /tmp/cs-eval
/clean-slate .
```

## Fixtures

- `fixtures/rotten-docs/` — real Node code plus a `CLAUDE.md` and `ROADMAP.md`
  that have drifted from it. Exercises the whole flow: inventory, the
  three-way salvage triage (a VERIFIED, a REFUTED, and several
  UNVERIFIABLE-FROM-CODE claims are all present by construction), the backup
  gate, and the anti-rot rule in the rebuild.
- `fixtures/ci-referenced-doc/` — a `docs/ARCHITECTURE.md` published by
  `mkdocs.yml`. Exercises the CI-reference gate reclassifying an
  in-scope-named file as KEEP.
- `fixtures/mixed-human-and-agent/` — a `docs/` tree mixing end-user docs
  (never delete), agent notes (in scope), and an ADR (ask, default KEEP).
  Exercises the classification boundaries.
