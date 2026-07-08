# Knowledge File Patterns

What counts as an agent-knowledge file (in scope for deletion), what never
does, and what to ask about. When in doubt: **KEEP and ask.**

## In scope — agent knowledge (candidates for deletion)

Instruction files agents load:

- `CLAUDE.md`, `CLAUDE.local.md` (root and nested)
- `AGENTS.md`, `AGENT.md`
- `.cursorrules`, `.cursor/rules/**`
- `.github/copilot-instructions.md`
- `.windsurfrules`, `.clinerules`
- `GEMINI.md`, `.junie/**`

Generated/accumulated knowledge docs:

- `docs/ARCHITECTURE.md`, `ARCHITECTURE.md`
- `ROADMAP.md`, `docs/ROADMAP.md`
- `docs/PLAN.md`, `docs/*PLAN*.md`, `PLANNING.md`, `TODO.md`
- `docs/adr/**`, `docs/decisions/**` (see "Ask" below — often worth keeping)
- `NOTES.md`, `SCRATCH.md`, `docs/notes/**`
- `MEMORY.md` and agent memory directories inside the repo

## Never delete

- `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, `SECURITY.md`
- End-user/product documentation (guides, API references, tutorials)
- Anything referenced by build/CI (`mkdocs.yml`, docusaurus content, files
  linked from package manifests)
- Code, tests, configs — obviously
- Anything outside the project root (global `~/.claude/**` is NEVER in scope)

## Ask the user (default KEEP)

- **ADRs / decision records** — they are history, not state; recommend
  keeping and letting the new ARCHITECTURE.md link to them.
- Docs that mix product documentation with agent notes.
- Any knowledge file modified within the last 7 days — it may reflect fresh
  intent; ask before including it in the delete list.
- Files matching in-scope patterns but with clearly human-authored,
  non-generated content the user may not remember writing.

## Detection commands

```bash
# Instruction files
fd -H -d 3 -t f '^(CLAUDE|AGENTS?|GEMINI)(\.local)?\.md$|^\.cursorrules$|^\.windsurfrules$|^\.clinerules$'

# Knowledge docs
fd -H -t f -e md . docs | head -50
git log --format='%ad %h' --date=short -1 -- <file>   # last-touched date per file
```

List results with last-modified dates so the user can judge freshness.

## CI-reference gate (run before presenting the delete list)

Mechanical version of the "referenced by build/CI" rule — run it, do not
eyeball it. For EVERY delete candidate:

```bash
grep -rln -F "<candidate-path>" \
  .github/ .gitlab-ci.yml mkdocs.yml docusaurus.config.* \
  package.json composer.json pyproject.toml Makefile Dockerfile \
  2>/dev/null
```

Any hit → the candidate is reclassified **KEEP** (note which config
references it). Zero hits → it stays a candidate. A file that CI builds,
lints, or publishes is not agent knowledge, whatever its name says.
