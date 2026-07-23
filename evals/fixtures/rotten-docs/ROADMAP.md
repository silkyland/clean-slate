# Roadmap

Written two years ago and never updated. Describes a product direction the
code never took — every phase below should fail re-verification against the
current source.

## Phase 1 — GraphQL API (in progress)

Replace the REST endpoints with a GraphQL schema. Apollo Server is already
wired in `src/graphql/`.

## Phase 2 — Admin dashboard

React admin panel under `admin/` for managing users and orders.

## Phase 3 — Multi-tenancy

Row-level tenant isolation across all tables.
