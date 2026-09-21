# VetOS — System Architecture Specification (`SYSTEM_ARCHITECTURE.md`)

## 1. Executive Summary

**VetOS** is a multi-tenant software-as-a-service (SaaS) platform architected as a clinical and operational operating system for veterinary practices. It scales from single-practitioner mobile clinics to multi-branch 24/7 veterinary hospitals and regional referral centers.

The defining architectural principle of VetOS is **Patient-Centricity**: the animal patient is the primary invariant entity of the platform. Every clinical encounter, diagnostic study, prescription, surgical note, invoice, and reminder permanently links to the patient's **Longitudinal Medical Timeline**.

---

## 2. High-Level Architectural Topology

To maximize development velocity, maintainability, and transactional integrity while avoiding the distributed system overhead of microservices, VetOS is architected as a **Modular Monolith** with clean architectural boundaries.

```
                     +-------------------------------------------------------+
                     |                     CLIENTS                           |
                     |  - Pet Owner Web / PWA (Consumer Portal)              |
                     |  - Clinical Staff Web / Tablet (Doctor Workspace)     |
                     |  - Reception & Triage (Live Queue Terminal)           |
                     |  - Hospitalization Board (Real-Time Bed Display)      |
                     +---------------------------+---------------------------+
                                                 | HTTPS / WSS
                                                 v
                     +-------------------------------------------------------+
                     |            EDGE & REVERSE PROXY LAYER                 |
                     |  - Traefik / Coolify Ingress (SSL, Subdomain Routing) |
                     |  - Tenant Resolver (Subdomain / Custom Domain)        |
                     |  - Rate Limiting & DDOS Protection (Redis Token Bucket)|
                     +---------------------------+---------------------------+
                                                 |
                                                 v
+-----------------------------------------------------------------------------------------+
|                                    VETOS APPLICATION CORE                               |
|                                                                                         |
|  +-----------------------------------------------------------------------------------+  |
|  | Presentation & API Layer (Next.js 15 App Router / Server Actions / Route Handlers) |  |
|  | - Tenant Context Middleware (`tenant_id`, `branch_id`, `user_id`, `role`)         |  |
|  | - RBAC / ABAC Central Policy Enforcement Interceptor                              |  |
|  | - Input Validation & Sanitization (Zod schemas)                                   |  |
|  +-----------------------------------------+-----------------------------------------+  |
|                                            |                                            |
|  +-----------------------------------------v-----------------------------------------+  |
|  | Domain & Application Layer (Modular Hexagonal Core)                               |  |
|  | [Organizations]  [Patients & Tutors]  [Timeline Engine]   [Resource Appointments] |  |
|  | [Consultations]  [Laboratory]         [Imaging & Studies] [Hospitalization Board] |  |
|  | [Surgery Engine] [Pharmacy & Stock]   [Pet Shop / POS]    [Billing & Invoicing]   |  |
|  +--------------------+--------------------+--------------------+--------------------+  |
|                       |                    |                    |                       |
|                       v                    v                    v                       |
|  +------------------------+  +------------------------+  +------------------------+     |
|  | Event Bus & Outbox     |  | Central Policy Engine  |  | Universal Search Engine|     |
|  | (Postgres Outbox Table)|  | (Decoupled RBAC Matrix)|  | (Postgres pg_trgm/GIN) |     |
|  +------------------------+  +------------------------+  +------------------------+     |
+---------------------------+--------------------+----------------+-----------------------+
                            |                    |                |
             +--------------+                    |                +-------------+
             |                                   |                              |
             v                                   v                              v
+------------------------+      +------------------------+      +------------------------+
|      DATA LAYER        |      |      CACHE & QUEUE     |      |    OBJECT STORAGE      |
| PostgreSQL 16+         |      | Redis 7+               |      | S3-Compatible / MinIO  |
| - Row-Level Security   |      | - BullMQ Async Workers |      | - Encrypted at rest    |
| - PgBouncer Pool       |      | - Ephemeral Sessions   |      | - Presigned URLs       |
| - Temporal Audit Logs  |      | - Real-Time Pub/Sub    |      | - Tenant isolated paths|
+------------------------+      +------------------------+      +------------------------+
             ^                                   ^                              ^
             |                                   |                              |
+------------+-----------------------------------+------------------------------+---------+
|                               EXTERNAL ADAPTER SUBSYSTEMS                               |
|  +-----------------------+  +-----------------------+  +-----------------------+        |
|  | ICommunicationProvider|  | IPaymentProvider      |  | IFiscalBillingProvider|        |
|  | - WhatsApp Cloud API  |  | - Mercado Pago SDK    |  | - ARCA / AFIP (Arg)   |        |
|  | - SendGrid / Resend   |  | - Stripe Adapter      |  | - Custom Fiscal Hook  |        |
|  +-----------------------+  +-----------------------+  +-----------------------+        |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Multi-Tenant Architecture & Data Isolation

VetOS utilizes a **Shared Database with Isolated Tenants (Row-Level Security)** model.

### 3.1 Tenant Resolution
1. **Subdomain Resolution:** `https://<tenant-slug>.vetos.app` maps directly to an active `organizations` record.
2. **Custom Domain:** Practices with private domains (e.g. `https://portal.clinicaveterinaria.com`) map via verified DNS CNAME table.
3. **Session Context:** The verified `tenant_id` is embedded in cryptographically signed JWT sessions and validated at middleware on every incoming request.

### 3.2 Tenant Isolation Guarantees
* Every tenant-owned table contains a mandatory non-nullable `tenant_id UUID REFERENCES organizations(id)`.
* Database connections apply PostgreSQL **Row-Level Security (RLS)**:
  ```sql
  ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
  CREATE POLICY tenant_isolation_policy ON patients
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
  ```
* Cross-tenant data leakage is strictly prevented at both the database query engine and application data mapper layers.

---

## 4. Subsystem Components & Data Flows

### 4.1 Modular Domain Architecture
Each business module encapsulates its domain entities, repository interfaces, and use cases:
* **Core & Tenancy:** Organization settings, branch management, room configuration, operating hours.
* **Patient & Tutor Management:** Co-ownership, authorized guardian permissions, microchip validation.
* **Longitudinal Timeline:** Append-only event store connecting consultations, lab results, imaging, prescriptions, and vaccines.
* **Resource-Aware Scheduling:** Prevents double-booking across 3 concurrent resource dimensions (Doctor, Room, Equipment).
* **Clinical Documentation:** High-speed structured forms with free-text support and clinical templates.
* **Hospitalization & Bed Manager:** Real-time whiteboard for inpatient wards, automated nursing task schedules (every 2/4/6 hours).
* **Pharmacy & Inventory:** Batch tracking, expiration alerts, automatic stock reserve from prescriptions, and movement audit logs.
* **Commerce & Billing:** Unified point-of-sale for clinical services and retail shop, integrated with payment gateways.

### 4.2 Asynchronous Event Pipeline (Transactional Outbox Pattern)
Clinical actions must remain fast and fault-tolerant. External notifications (WhatsApp, emails) and background calculations never block clinical HTTP requests:
1. When a consultation is finalized or a vaccine registered, the mutation writes the domain change **and** an event row to the `automation_events` table in a single atomic database transaction.
2. A lightweight background worker (BullMQ + Redis) polls/consumes outbox events.
3. The event triggers registered automation rules (e.g. "Send rabies vaccination reminder in 335 days via WhatsApp").

---

## 5. Security & Compliance Architecture

1. **Authentication:** Secure HTTP-only session cookies with CSRF tokens and optional TOTP two-factor authentication for administrative and clinical accounts.
2. **Server-Side Authorization (RBAC + ABAC):** Permissions are validated strictly server-side through a central policy engine. The UI reflects permissions for UX purposes but never acts as a security boundary.
3. **Audit Trail:** All insertions, modifications, soft-deletions, and sensitive reads (patient health records) write to an append-only `audit_logs` table capturing `actor_id`, `tenant_id`, `action`, `entity_type`, `entity_id`, `diff_json`, `ip_address`, and `user_agent`.
4. **Soft Deletions:** Critical entities (`patients`, `consultations`, `prescriptions`, `lab_orders`) utilize `deleted_at TIMESTAMP WITH TIME ZONE NULL` to guarantee medical record integrity.

---

## 6. Infrastructure & Deployment Model

* **Target Runtime:** Linux VPS managed via **Coolify** / Docker Compose.
* **Containers:**
  * `vetos-web`: Next.js production container (Node 20 / Alpine).
  * `vetos-worker`: BullMQ background worker for automations, scheduled reminders, and report generation.
  * `postgres`: PostgreSQL 16 with `pg_trgm`, `uuid-ossp`, and `pgcrypto`.
  * `redis`: Redis 7 with AOF persistence.
  * `minio`: S3-compatible asset and diagnostic image storage.
* **Reverse Proxy:** Traefik with automated Let's Encrypt wildcard SSL (`*.vetos.app`).
