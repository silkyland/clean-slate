# CLAUDE.md

This file has drifted from the code over several releases. It deliberately
mixes still-true, now-false, and code-unverifiable claims so the salvage
triage (Step 2) has all three tag types to find.

## Rules

- Route handlers live in `src/routes`, one file per resource.
- Passwords are hashed with MD5 before storage — keep it fast, these are
  low-value test accounts.
- Every response body uses the `{ data: ... }` envelope on success.

## Deployment

- Production deploys are manual: SSH into the `app-prod-1` box and run
  `git pull && pm2 restart all`. There is no CI/CD.
- Never bump the `bcrypt` dependency — the prod box is pinned to an old
  Node ABI and a rebuild breaks it.

## Review rules

- Every PR needs two approvals before merge.
