# VetOS — Proposed Repository Structure (`REPOSITORY_STRUCTURE.md`)

## 1. Modular Monolith Directory Layout

The codebase is organized as a clean **Modular Monolith** using the Next.js 15 App Router architecture. It separates domain logic, infrastructure adapters, shared UI components, and role-specific workspace routes.

```
vetos/
├── docs/                                  # Architectural Specifications
│   ├── README.md                          # Master Documentation Index
│   ├── SYSTEM_ARCHITECTURE.md             # Multi-tenant SaaS & Infrastructure Topology
│   ├── DOMAIN_MODEL.md                    # Patient-Centric Longitudinal Model
│   ├── DATABASE_SCHEMA.md                 # PostgreSQL DDL & Indices
│   ├── RBAC_MATRIX.md                     # 12-Role Capability Matrix & Policy Engine
│   ├── MVP_SCOPE.md                       # Phased Delivery Roadmap (Phases 1-4)
│   ├── USER_FLOWS.md                      # Clinical State Machines & User Journeys
│   ├── API_DESIGN.md                      # REST Endpoints, Envelopes & Contracts
│   └── TEST_STRATEGY.md                   # QA Pyramid & Playwright POM Specs
│
├── prisma/                                # Database Persistence (or src/db/schema)
│   ├── schema.prisma                      # Multi-tenant Relational Schema
│   ├── migrations/                        # Versioned SQL Migrations
│   └── seed.ts                            # Test Data & Multi-Tenant Seed Scripts
│
├── src/
│   ├── app/                               # Next.js App Router (Route Handlers & Pages)
│   │   ├── (auth)/                        # Authentication & Onboarding Routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (marketing)/                   # Public Landing & Tenant Microsite
│   │   │   └── page.tsx                   # Hospital Presentation, 24h Guard & Services
│   │   │
│   │   ├── (portals)/                     # Authenticated Role-Based Workspaces
│   │   │   ├── owner/                     # Pet Owner / Tutor Consumer Portal
│   │   │   │   ├── pets/                  # Pet Profiles, Vaccinations & History
│   │   │   │   ├── appointments/          # Self-Service Resource-Aware Booking
│   │   │   │   └── shop/                  # Pharmacy Refills & Pet Supplies
│   │   │   │
│   │   │   ├── vet/                       # Professional Clinical Workspace
│   │   │   │   ├── patients/              # Universal Search, Patient Directory
│   │   │   │   ├── timeline/              # Longitudinal Patient Timeline Stream
│   │   │   │   ├── consultations/         # High-Speed Medical Encounter Form
│   │   │   │   ├── prescriptions/         # Signed Electronic Prescriptions
│   │   │   │   └── labs/                  # Diagnostic Orders & Result Reviews
│   │   │   │
│   │   │   ├── reception/                 # Front Desk & Operational Queue
│   │   │   │   ├── queue/                 # Live Waiting Room Triage Whiteboard
│   │   │   │   ├── check-in/              # Rapid Patient Arrival Intake
│   │   │   │   └── calendar/              # Resource-Aware Multi-Room Calendar
│   │   │   │
│   │   │   ├── hospitalization/           # Inpatient Wards & Intensive Care
│   │   │   │   ├── whiteboard/            # Real-Time Cage / Kennel Status Board
│   │   │   │   └── rounds/                # Scheduled Nursing Clinical Tasks
│   │   │   │
│   │   │   ├── pharmacy/                  # Pharmacy & Inventory Dispensary
│   │   │   │   ├── stock/                 # SKU, Lot & Expiration Tracking
│   │   │   │   └── dispense/              # Direct Prescription Dispensing Queue
│   │   │   │
│   │   │   └── admin/                     # Organization & Branch Management
│   │   │       ├── branches/              # Branch, Room & Equipment Setup
│   │   │       ├── staff/                 # User Accounts, Licenses & Shifts
│   │   │       ├── billing/               # Invoices, Payments & Cash Registers
│   │   │       └── audit-logs/            # Security & Clinical Audit Records
│   │   │
│   │   └── api/v1/                        # Programmatic REST API Endpoints
│   │       ├── auth/                      # Session & Token Management
│   │       ├── patients/                  # Patient CRUD & Timeline Stream
│   │       ├── appointments/              # Resource Allocation & Scheduling
│   │       ├── consultations/             # Clinical Records & Prescriptions
│   │       ├── queue/                     # Live Triage Operations
│   │       ├── hospitalization/           # Ward & Task Endpoints
│   │       └── webhooks/                  # Mercado Pago, WhatsApp Cloud Ingress
│   │
│   ├── domain/                            # Pure Domain Entities & Business Rules
│   │   ├── tenancy/                       # Organization, Branch, Module Activation
│   │   ├── patient/                       # Patient, Tutor, Guardianship, Allergies
│   │   ├── timeline/                      # Event Stream Aggregator & Types
│   │   ├── clinical/                      # Consultations, Vitals, Diagnoses
│   │   ├── scheduling/                    # Resource Collision Algorithm
│   │   ├── diagnostics/                   # Lab & Imaging Models
│   │   ├── inpatient/                     # Hospitalization, Bed Allocation, Nursing Tasks
│   │   └── inventory/                     # Batches, Stocks, Dispensing Logic
│   │
│   ├── lib/                               # Application Core & Shared Utilities
│   │   ├── auth/                          # Central RBAC Policy Engine & Session Guards
│   │   ├── db/                            # Postgres Connection Pool (Prisma Client)
│   │   ├── queue/                         # BullMQ / Redis Async Job Processors
│   │   ├── storage/                       # S3 / MinIO Presigned File Uploaders
│   │   ├── events/                        # Transactional Outbox Pattern Dispatcher
│   │   └── utils/                         # Date Formatting, Dosage Calculations
│   │
│   ├── components/                        # UI Component Library (shadcn/ui + Tailwind)
│   │   ├── ui/                            # Atomic Primitives (Button, Modal, Input, Badge)
│   │   ├── clinical/                      # VaccinationPass, VitalGauges, TimelineFeed
│   │   ├── scheduling/                    # TimeGrid, RoomSelector, ResourcePicker
│   │   ├── inpatient/                     # BedCard, NursingTaskRow, StatusChip
│   │   └── shared/                        # Navbar, UniversalSearch, NotificationBell
│   │
│   └── adapters/                          # External Infrastructure Adapters
│       ├── communication/                 # ICommunicationProvider (WhatsApp, Email)
│       ├── payment/                       # IPaymentProvider (Mercado Pago, Stripe)
│       └── billing/                       # IFiscalBillingProvider (Tax / Invoice Hook)
│
├── tests/
│   ├── unit/                              # Vitest Unit Tests (RBAC, Dosages, Collision)
│   ├── integration/                       # Tenant Isolation & Transaction Tests
│   └── e2e/                               # Playwright End-to-End Test Suites (POM)
│
├── docker-compose.yml                     # Local & Production Dev Stack (Postgres, Redis, MinIO)
├── Dockerfile                             # Multi-stage Alpine Production Build
├── package.json
└── tsconfig.json
```
