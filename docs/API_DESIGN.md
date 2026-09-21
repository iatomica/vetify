# VetOS — API Contract & Endpoint Design (`API_DESIGN.md`)

## 1. Architectural Style & Communication Standards

VetOS exposes a unified API layer built with **Next.js 15 Route Handlers** (for programmatic integrations, mobile, and webhooks) supplemented by **Server Actions** (for high-efficiency UI form submissions).

### 1.1 Request Headers & Multi-Tenant Resolution
* `Host: <tenant-slug>.vetos.app` (primary resolution mechanism)
* `X-Tenant-ID: <uuid>` (for API clients or internal service tokens)
* `X-Branch-ID: <uuid>` (active clinical branch context)
* `Authorization: Bearer <jwt>` or session cookie `vetos_session`
* `Idempotency-Key: <uuid>` (mandatory on financial and dispensing endpoints)

### 1.2 Unified Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_88a91c",
    "timestamp": "2026-09-21T17:15:00Z",
    "pagination": { "page": 1, "pageSize": 20, "total": 142 }
  }
}
```

### 1.3 RFC 7807 Error Protocol
```json
{
  "success": false,
  "error": {
    "type": "https://vetos.app/errors/resource-conflict",
    "title": "Double Booking Detected",
    "status": 409,
    "detail": "Operating Room 1 is already allocated for Surgery #SRG-102 at 10:30 AM.",
    "instance": "/api/v1/appointments"
  }
}
```

---

## 2. Core REST Endpoints by Domain Module

### 2.1 Authentication & Tenancy
* `POST /api/v1/auth/login` — Authenticates credentials, returns session and permissions.
* `POST /api/v1/auth/switch-branch` — Updates active branch context in user session.
* `GET  /api/v1/organization/settings` — Returns practice profile and active modules.

### 2.2 Patients & Longitudinal Timeline
* `GET  /api/v1/patients?search=Milo&species=CANINE` — Universal search directory.
* `POST /api/v1/patients` — Registers animal patient linked to tutor(s).
* `GET  /api/v1/patients/:id` — Full patient clinical summary with alerts and active conditions.
* `GET  /api/v1/patients/:id/timeline?type=CONSULTATION,LAB_RESULT` — Paginated medical timeline.
* `POST /api/v1/patients/:id/timeline-note` — Appends free-text internal clinical note.

### 2.3 Resource-Aware Scheduling & Live Queue
* `GET  /api/v1/appointments/available-slots?serviceId=&branchId=&date=` — Returns unconflicted slots across doctor, room, and equipment.
* `POST /api/v1/appointments` — Books appointment with resource lock.
* `PATCH /api/v1/appointments/:id/status` — Updates status (`CONFIRMED`, `CANCELLED`, `NO_SHOW`).
* `GET  /api/v1/queue/live?branchId=` — Real-time waiting room queue state.
* `POST /api/v1/queue/check-in` — Receives patient at desk with triage urgency rating.
* `POST /api/v1/queue/:id/call-to-box` — Signals doctor room and alerts waiting area.

### 2.4 Clinical Documentation & Prescriptions
* `POST /api/v1/consultations` — Creates consultation with vitals, exam notes, and diagnoses.
* `GET  /api/v1/consultations/:id` — Returns consultation details and attached orders.
* `POST /api/v1/prescriptions` — Creates and cryptographically signs medical prescription.
* `POST /api/v1/prescriptions/:id/dispense` — Pharmacy endpoint to dispense and decrement inventory batch.

### 2.5 Diagnostics (Laboratory & Imaging)
* `POST /api/v1/labs/orders` — Submits laboratory investigation request.
* `POST /api/v1/labs/orders/:id/results` — Inputs quantitative results and attaches PDF.
* `POST /api/v1/imaging/orders` — Orders diagnostic imaging (X-Ray, Ultrasound, CT).
* `POST /api/v1/imaging/orders/:id/report` — Submits imaging findings, conclusions, and images.

### 2.6 Hospitalization (Inpatient Management)
* `GET  /api/v1/hospitalization/whiteboard?branchId=` — Live bed status, patient condition, and next tasks.
* `POST /api/v1/hospitalization/admit` — Allocates bed and establishes initial clinical orders.
* `PATCH /api/v1/hospitalization/tasks/:id/execute` — Nurse marks task `DONE`, `SKIPPED`, or `DELAYED`.
* `POST /api/v1/hospitalization/:id/discharge` — Finalizes inpatient stay and generates owner discharge guide.

### 2.7 Inventory & Pet Shop POS
* `GET  /api/v1/inventory?category=PHARMACY&lowStock=true` — Filtered stock listing.
* `POST /api/v1/inventory/transactions` — Logs purchase, adjustment, or write-off.
* `POST /api/v1/pos/orders` — Processes retail or pharmacy cart order.

### 2.8 Billing & Payments
* `POST /api/v1/invoices` — Compiles billable encounters into an official invoice.
* `POST /api/v1/payments/process` — Executes payment via `IPaymentProvider` (e.g. Mercado Pago / Card).
