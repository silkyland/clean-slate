# ci-referenced-doc

A clean-slate eval fixture: `docs/ARCHITECTURE.md` matches an in-scope
deletion pattern but is published by the MkDocs site (`mkdocs.yml`). The
CI-reference gate must catch that and reclassify it KEEP.
