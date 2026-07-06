# clean-slate

**Safe re-initialization of a project's agent knowledge — burn the rotten
docs, rebuild from the code and the user's intent.**

`clean-slate` is an [agent skill](https://vercel.com/docs/agent-resources/skills)
for the day your knowledge files stop helping: `CLAUDE.md` contradicts the
code, three generations of agents left conflicting notes, the roadmap
describes a project that no longer exists. Past that point, patching costs
more than rebuilding.

## What it does

```
/clean-slate .
```

1. **Inventory** — finds every agent-knowledge file (CLAUDE.md, AGENTS.md,
   cursor rules, architecture docs, roadmaps, old plans) and classifies each
   delete / keep / ask. Human docs (README, CHANGELOG, end-user docs) are
   never in scope.
2. **Salvage** — mines the old files for load-bearing claims and re-verifies
   each against the current code. Only claims with a fresh `file:line`
   citation survive.
3. **Backup gate** ⛔ — presents the exact delete list and asks where to back
   it up (recommended: `docs/_archive/<date>/` + a git tag). **Nothing is
   deleted without an explicit answer.**
4. **Clean** — backs up, verifies the backup, deletes only the confirmed list.
5. **Fresh read** — inventories the codebase from source: structure, wiring,
   data flow, git trajectory. Old docs are gone and are not trusted from
   memory.
6. **Direction interview** — asks the user where the project should go: one
   question at a time, each with a recommended answer grounded in the code,
   five questions max.
7. **Rebuild** — writes a strong, thin, fully-cited knowledge set:
   `AGENTS.md` (under 150 lines), `docs/ARCHITECTURE.md`, `ROADMAP.md`.
8. **Report** — deleted / backed up / salvaged / dropped-as-false / created.

The philosophy is shared with the [deep-plan](https://github.com/silkyland/deep-plan)
skill family: **no claim without evidence** — and additionally: **no deletion
without a confirmed backup decision.** A thin true document beats a thick
maybe-true one.

## Install

```bash
npx skills add silkyland/clean-slate
```

Or copy this directory into your agent's skills folder
(e.g. `~/.claude/skills/clean-slate/`).

## Structure

```
clean-slate/
├── SKILL.md                              # 8-step workflow + safety rules
└── references/
    ├── knowledge-file-patterns.md        # What's in scope, what's untouchable
    ├── interview-guide.md                # The direction interview question bank
    └── rebuild-templates.md              # AGENTS.md / ARCHITECTURE.md / ROADMAP.md structures
```

Follows the [Vercel skills](https://github.com/vercel-labs/skills) single-skill
layout and [Anthropic's skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

## Companion skills

- [`deep-plan`](https://github.com/silkyland/deep-plan) — clean-slate rebuilds
  *what is*; deep-plan designs *what's next*. Typical flow: clean-slate once,
  then deep-plan per major feature, then deep-plan-ingest to keep the
  knowledge current.

## License

MIT
