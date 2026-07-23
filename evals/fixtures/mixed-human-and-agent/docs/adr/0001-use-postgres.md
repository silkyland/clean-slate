# 1. Use PostgreSQL

- **Status:** accepted
- **Date:** 2023-02-10

## Context

We needed a relational store with strong JSON support for widget metadata.

## Decision

Use PostgreSQL 15 as the primary datastore.

## Consequences

Row-level security is available if we later add multi-tenancy. This is a
decision record — history, not current state — so clean-slate should default
to KEEP and ask rather than deleting it.
