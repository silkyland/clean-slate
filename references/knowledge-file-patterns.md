# Knowledge File Patterns

What counts as an agent-knowledge file (in scope for deletion), what never
does, and what to ask about. Three buckets, kept strictly separate:

- **Candidates** — agent knowledge; the only files that can be deleted.
- **Never** — human docs, code, configs, CI-referenced files; not even
  presented as candidates.
- **Ask** — ambiguous; surfaced for a user decision, default KEEP.

When in doubt: **KEEP and ask.**

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
- `NOTES.md`, `SCRATCH.md`, `docs/notes/**`
- `MEMORY.md` and agent memory directories inside the repo

## Never delete

- `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, `SECURITY.md`
- End-user/product documentation (guides, API references, tutorials)
- Anything referenced by build/CI/docs-site config — the gate below
  enforces this mechanically; it is never a judgment call
- Code, tests, configs — obviously
- `.clean-slate/` — this skill's own state directory (working memory,
  never committed)
- `docs/_archive/` — this skill's own backups from earlier runs
- Anything outside the project root (global `~/.claude/**` is NEVER in scope)

A candidate-pattern file that a kept human doc links to (e.g. README →
`docs/NOTES.md`) is a judgment call, not a gate hit: default KEEP and put
it in the **ask** bucket.

## Ask the user (default KEEP)

- **ADRs / decision records** (`docs/adr/**`, `docs/decisions/**`) — they
  are history, not state, so the skill never proposes deleting them;
  recommend keeping and letting the new ARCHITECTURE.md link to them. Only
  an explicit user instruction changes that.
- Docs that mix product documentation with agent notes.
- Any knowledge file modified within the last 7 days — it may reflect fresh
  intent; ask before including it in the delete list.
- Files matching in-scope patterns but with clearly human-authored,
  non-generated content the user may not remember writing.

## Detection commands

```bash
# Instruction files
fd -H -d 3 -t f '^(CLAUDE|AGENTS?|GEMINI)(\.local)?\.md$|^\.cursorrules$|^\.windsurfrules$|^\.clinerules$'

# Knowledge docs — every markdown file is a candidate for review
# (excludes keep this skill's own state dir and past backups out of the results)
fd -H -t f -e md --exclude '.clean-slate' --exclude 'docs/_archive' | head -50
# if the count hits 50, raise or remove the cap — every markdown file is a candidate
git log --format='%ad %h' --date=short -1 -- <file>   # last-touched date per file
```

No `fd`? `find` covers the common cases (run from the repo root):

```bash
find . -path ./.git -prune -o -type f \( \
  -name 'CLAUDE*.md' -o -name 'AGENT*.md' -o -name 'GEMINI*.md' \
  -o -name '.cursorrules' -o -name '.windsurfrules' -o -name '.clinerules' \
  -o -name 'copilot-instructions.md' \) -print
find . -path ./.git -prune -o -path './.clean-slate' -prune -o \
  -path './docs/_archive' -prune -o \
  -type f -name '*.md' -print | head -50   # knowledge docs (raise/remove cap at 50)
```

Dir-based patterns (`.cursor/rules/**`, `.junie/**`, `.github/copilot-instructions.md`)
are listed under "In scope" — check for them by hand. Detection is a net,
not a verdict: every hit still goes through classification and the
CI-reference gate.

List results with last-modified dates so the user can judge freshness.

## CI-reference gate (run before presenting the delete list)

Mechanical version of the "referenced by build/CI" rule — run it, do not
eyeball it. For EVERY delete candidate:

```bash
# <basename> also matches path-qualified references like docs/ARCHITECTURE.md
grep -rln -F "<candidate-basename>" \
  .github/ .gitlab-ci.yml .gitlab/ .circleci/ Jenkinsfile .travis.yml \
  azure-pipelines.yml bitbucket-pipelines.yml .buildkite/ bitrise.yml \
  mkdocs.yml SUMMARY.md .gitbook.yaml .vitepress/ docs.json \
  antora.yml antora-playbook.yml hugo.toml config.toml _config.yml \
  netlify.toml vercel.json \
  docusaurus.config.js docusaurus.config.ts docusaurus.config.mjs docusaurus.config.cjs \
  package.json composer.json pyproject.toml Cargo.toml go.mod \
  Makefile Dockerfile \
  2>/dev/null
```

List the config filenames explicitly rather than a `docusaurus.config.*`
glob — under zsh an unmatched glob aborts the whole command before `grep`
runs, silently skipping the gate. Missing files and directories are
harmless: `grep` reports them to stderr, which `2>/dev/null` swallows —
judge by output, not exit status (it is nonzero whenever anything was
missing). Basename matching is deliberate: it is a superset that can only
over-KEEP, and over-KEEP is the safe direction.

Any output → the candidate is reclassified **KEEP** (note which config
references it). No output → it stays a candidate. A file that CI builds,
lints, or publishes is not agent knowledge, whatever its name says.
