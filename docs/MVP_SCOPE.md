# VetOS — Product Roadmap & MVP Scope (`MVP_SCOPE.md`)

## 1. Development Methodology & Phased Progression

To guarantee stability, architectural integrity, and real clinical usability, **VetOS** is built through disciplined vertical slices rather than attempting a monolithic launch.

---

## 2. Phase 1: Clinical & Operational Foundation (MVP)

### 2.1 Core Capabilities
1. **Multi-Tenancy & Access Control:**
   * Tenant resolution via subdomain/header.
   * Secure session-based authentication with RBAC policy engine.
   * Organization, Branch, Room, and Staff profile management.
2. **Patient & Tutor Registry:**
   * Universal search by patient name, microchip, tutor phone, and DNI.
   * Patient profile: species, breed, sex, age, weight, microchip ISO validation, allergies, chronic conditions.
   * Co-tutors and authorized guardians.
3. **Longitudinal Medical Timeline:**
   * Chronological append-only timeline feed for each patient.
   * Event filters (consultations, vaccines, prescriptions, documents).
4. **Resource-Aware Scheduling:**
   * Multi-constraint booking (Doctor schedule, Room availability, Service duration).
   * Daily, weekly, and doctor-filtered calendar views.
   * Reception live waiting room queue with triage check-in.
5. **Clinical Documentation:**
   * High-speed consultation screen with vital signs, anamnesis, physical exam, and dual diagnosis (presumptive and confirmed).
   * Reusable clinical templates (General, Vaccine, Dermatology, Geriatric).
6. **Prescriptions & Vaccines:**
   * Signed medical prescriptions with dosage, frequency, and duration.
   * Official vaccination records with batch number, expiration, and automated next-due-date calculator.
7. **Document Management & Auditing:**
   * Secure file upload with tenant isolation.
   * Comprehensive append-only audit trail.
8. **Basic Billing & Client Portal:**
   * Service receipt generation and payment tracking.
   * Responsive Pet Owner portal for booking, viewing digital passports, and past consultations.

---

## 3. Phase 2: Diagnostics, Pharmacy & Automation Engine

1. **Laboratory Workflow:**
   * Electronic lab orders (CBC, renal profile, urinalysis).
   * Status lifecycle: `ORDERED` -> `SAMPLE_COLLECTED` -> `PROCESSING` -> `RESULT_AVAILABLE`.
   * Structured reference intervals and PDF report attachments.
2. **Diagnostic Imaging:**
   * Orders for X-ray, Ultrasound, CT, Endoscopy.
   * Radiologist findings and conclusion reporting.
3. **Pharmacy & Inventory Management:**
   * Stock tracking with batch numbers and expiration dates.
   * Direct dispensing from electronic prescriptions with inventory decrement.
   * Low stock and expiration alerts.
4. **Event-Driven Automation Engine:**
   * Outbox pattern processor consuming clinical events.
   * Triggering automated reminders (e.g. vaccination due in 30 days, follow-up required).
5. **Abstracted Communication Layer:**
   * `ICommunicationProvider` implementation for WhatsApp Cloud API and transactional email.

---

## 4. Phase 3: Inpatient Care, Surgical Episodes & Commercial Expansion

1. **Hospitalization Management:**
   * Real-time visual ward whiteboard (Box 01, Bed 02, ICU Oxygen Cage).
   * Scheduled nursing clinical tasks (medications, temperature, feeding every 2/4/6h).
   * Nurse task completion logging (`DONE`, `SKIPPED`, `DELAYED`).
2. **Surgery Workflow:**
   * Surgical episodes (`SURGERY_INDICATED` through `RECOVERY`).
   * Anesthesia monitoring record, pre-op checklists, and digital owner consent signing.
3. **Internal & External Referrals:**
   * Inter-branch and specialist referral orders with attached medical summaries.
4. **Pet Shop & eCommerce:**
   * Retail catalog integrated with clinical inventory.
   * Prescription-aware checkout (validating doctor prescription for therapeutic diets).
5. **Mobile Care & Telemedicine:**
   * Home visit coverage zones and travel scheduling.
   * Virtual teleconsultation room linked to the patient record.

---

## 5. Phase 4: Enterprise, Networks & AI Clinical Copilot

1. **Membership & Preventive Health Plans:**
   * Recurring subscriptions with automated quota consumption (e.g. 2 free consultations/year).
2. **AI Clinical Assistant (Human-in-the-Loop):**
   * Ambient consultation transcription and draft note structuring.
   * Automated discharge summary drafting for pet owners.
   * Strict safety guardrail: AI never autonomously diagnoses or prescribes.
3. **Multi-Branch Enterprise Analytics:**
   * Financial yield, drug consumption velocities, and hospital bed occupancy KPIs.
4. **Regional Veterinary Referral Network:**
   * Secure external hospital sharing with certified data redaction.
