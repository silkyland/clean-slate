# mixed-human-and-agent

A clean-slate eval fixture whose `docs/` mixes three kinds of file, to test
the classification boundaries:

- `docs/user-guide.md` — end-user product documentation → **never delete**
- `docs/NOTES.md` — accumulated agent scratch notes → **in scope**
- `docs/adr/0001-use-postgres.md` — a decision record → **ask, default KEEP**
