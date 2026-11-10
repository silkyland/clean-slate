# State file

The state file keeps a run's progress on disk, so an interrupted session —
context reset, crashed host, hand-off to a fresh agent — resumes instead of
restarting or, worse, re-asking gates the user already answered.

## Location

`.clean-slate/state.md` in the project root (the resolved target root, not
necessarily the cwd). Create the directory if needed. It is working memory:
**never committed, never a deletion candidate** — it does not match the
knowledge-file patterns, and a future clean-slate run ignores it.

## Template

```markdown
# clean-slate state

step: <last completed step; "done" once Step 8 has reported>
root: <absolute project root used>
auth: <how the delete gate was satisfied: pre-authorized "<invocation quote>" | confirmed <date> | headless-recommended>
mode: attended | headless

## Inventory
| Path | Class (delete/keep/ask) | CI-ref hit | Note |
|------|-------------------------|------------|------|

## Salvage tally
mined: <N> | VERIFIED: <n> | REFUTED: <n> | UNVERIFIABLE-FROM-CODE: <n>
(claim-level detail stays in your working notes or a findings file under .clean-slate/)

## Backup
location: <archive path or "git only">
count check: <archived N files / delete list M — match?>
tag: <git tag or none — not a repo>

## Interview
status: pending | done | headless-derived | skipped (just-do-it)
brief: <the confirmed 5–10 line Direction Brief, or pointer>
unconfirmed: <count of UNCONFIRMED lines>

## Rebuild
targets: <paths actually written — note .agent.md variants and merges>
premortem: <rot cause → the AGENTS.md rule written>
checks: <mechanical check results>
```

## Keeping it

- Update it at each step exit, before starting the next step. On a small
  run, once after Step 2 and once after Step 5 is enough — but the backup
  record (Step 4) and the auth record (Step 3) are never optional: they
  are what make resuming safe.
- Store facts, not prose. The inventory table and tallies are the
  load-bearing parts; do not paste file contents.
- When a recorded fact is superseded (user changes their mind, a file
  appears), replace the row — do not append contradictions.

## Resuming

A session that finds an existing state file:

1. Reads it and notes `step` — the last **completed** step.
2. Reconciles state with reality before acting: do the files classed
   delete still exist? Does the recorded backup exist and do its counts
   still match the delete list? The repo is the truth; if they disagree,
   trust the repo and fix the state file. If the delete list is already
   fully gone but `step` says earlier, the run was interrupted inside
   Step 4 — verify the backup counts once more, then continue at Step 5.
3. Tells the user in one line where it is resuming from.
4. Continues at the next step **without re-asking satisfied gates** —
   `auth` and the backup record already answer Step 3. Before deleting any
   remaining files, re-run the count check anyway: it is one command and
   it is the only thing standing between a resume and an unverified
   deletion.
5. Re-opens any VERIFIED citation whose file changed since the state file
   was written (`git log` on the cited paths); without git, re-open them
   all. A citation that no longer matches is fixed and the claim re-tagged
   — a resumed run inherits the same evidence rules as a fresh one.
