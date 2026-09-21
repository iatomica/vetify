# VetOS — Architectural & Engineering Documentation

This directory contains the foundational specifications, domain architecture, database schemas, RBAC definitions, user flows, API design, and testing strategy for **VetOS**, a production-grade multi-tenant Veterinary Operating System.

## Index of Architectural Artifacts

1. [**SYSTEM_ARCHITECTURE.md**](./SYSTEM_ARCHITECTURE.md) — Multi-tenant SaaS topology, modular monolith architecture, async pipelines, infrastructure and deployment model.
2. [**DOMAIN_MODEL.md**](./DOMAIN_MODEL.md) — Patient-centric domain entities, longitudinal medical timeline, and cross-module relationships.
3. [**DATABASE_SCHEMA.md**](./DATABASE_SCHEMA.md) — Comprehensive PostgreSQL schema, tenant isolation, indexes, constraints, and audit logging.
4. [**RBAC_MATRIX.md**](./RBAC_MATRIX.md) — Role-Based Access Control matrix across 12 roles, action-level permissions, and central policy evaluation.
5. [**MVP_SCOPE.md**](./MVP_SCOPE.md) — Phased delivery plan from MVP Phase 1 through Phase 4 enterprise readiness.
6. [**USER_FLOWS.md**](./USER_FLOWS.md) — End-to-end clinical and operational workflows, status state machines, and reception queue logic.
7. [**API_DESIGN.md**](./API_DESIGN.md) — Multi-tenant routing, REST / Server Actions contracts, error protocols, and integration points.
8. [**TEST_STRATEGY.md**](./TEST_STRATEGY.md) — Quality assurance pyramid, tenant isolation test suites, and Playwright POM specifications.
