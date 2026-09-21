# VetOS — Comprehensive Test Strategy & QA Architecture (`TEST_STRATEGY.md`)

## 1. Quality Assurance Philosophy

Clinical systems require exceptional reliability. In **VetOS**, a bug in medication dispensing, allergy checking, or double-booking an operating room has immediate real-world consequences.

Our test strategy is structured around the **Testing Pyramid**:

```
           / \
          /   \     E2E Tests (Playwright / POM)
         / E2E \    - 18 Critical Cross-Role Workflows
        /-------\
       /  INTEG  \  Integration & Tenant Isolation Tests
      /   RATION  \ - DB Constraints, RLS, Race Conditions
     /-------------\
    /     UNIT      \ Unit Tests (Vitest)
   /                 \ - Business Invariants, RBAC, Calculations
  +-------------------+
```

---

## 2. Unit Testing Layer (Vitest)

* **Coverage Target:** > 85% on domain logic and utility services.
* **Scope:**
  * **RBAC Evaluation:** Comprehensive matrix checks testing all 12 roles against every capability.
  * **Dosage & Clinical Math:** Volume/kg calculations, drip rates, body condition scoring adjustments.
  * **Resource Collision Detection:** Algorithmic intersection testing for schedules, rooms, and doctors.
  * **Event Outbox Generation:** Confirming events serialize with required domain payloads.

---

## 3. Integration & Multi-Tenant Security Testing

* **PostgreSQL Row-Level Security (RLS) Assertions:**
  ```typescript
  test('Tenant A user cannot read Tenant B patients even with explicit ID query', async () => {
    const tenantAClient = createTestClient({ tenantId: 'tenant-a-uuid' });
    const tenantBPatient = await createPatientInTenant('tenant-b-uuid');

    const result = await tenantAClient.patients.findById(tenantBPatient.id);
    expect(result).toBeNull();
  });
  ```
* **Concurrent Booking Race Conditions:**
  * Simulate 5 concurrent booking requests for the exact same operating room and doctor at 10:00 AM.
  * Exactly **one** transaction must succeed; four must fail with `409 Conflict`.
* **Inventory Dispensing Atomicity:**
  * Test partial and full stock dispensing under concurrent load.
  * Ensure batch tracking does not decrement below zero and generates accurate ledger entries.

---

## 4. End-to-End Testing (Playwright with Page Object Model)

Playwright tests run against an isolated test tenant database seeded before each test cycle.

### 4.1 Page Object Model (POM) Structure
```
tests/e2e/
  ├── pages/
  │   ├── LoginPage.ts
  │   ├── PatientRegistryPage.ts
  │   ├── PatientTimelinePage.ts
  │   ├── AppointmentBookingModal.ts
  │   ├── ReceptionQueuePage.ts
  │   ├── ConsultationWorkspacePage.ts
  │   ├── PharmacyDispensaryPage.ts
  │   └── HospitalizationWhiteboardPage.ts
  └── specs/
      ├── 01_tenant_isolation.spec.ts
      ├── 02_rbac_authorization.spec.ts
      ├── 03_owner_and_patient_creation.spec.ts
      ├── 04_appointment_lifecycle.spec.ts
      ├── 05_reception_triage_checkin.spec.ts
      ├── 06_clinical_consultation_and_rx.spec.ts
      ├── 07_vaccination_record.spec.ts
      ├── 08_lab_order_and_results.spec.ts
      ├── 09_hospitalization_nursing_tasks.spec.ts
      ├── 10_surgery_workflow.spec.ts
      ├── 11_pharmacy_dispensing.spec.ts
      └── 12_invoice_and_payment.spec.ts
```

### 4.2 Priority E2E Workflow Matrix
1. **Owner Registration:** Public registration and automated tenant binding.
2. **Patient Creation:** Registering canine with breed, ISO microchip, and allergy tags.
3. **Appointment Booking:** Selecting specialist + ultrasound equipment + available room.
4. **Appointment Cancellation & Rescheduling:** Releasing locked resources.
5. **Appointment Check-In:** Reception queue entry and staff-confirmed triage.
6. **Clinical Consultation:** Doctor call-to-box, examination, dual diagnoses, and sign-off.
7. **Prescription Lifecycle:** Adding medication, checking allergy conflicts, and digital signing.
8. **Laboratory Ordering:** Vet orders blood panel; order appears in lab work queue.
9. **Laboratory Result Entry:** Tech uploads findings; result automatically renders in timeline.
10. **Vaccination Registration:** Batch tracking and auto-generation of 365-day reminder.
11. **Hospital Admission:** Assigning ICU kennel and generating 4-hour task rotation.
12. **Medication Administration:** Nurse scans kennel and records administration as `DONE`.
13. **Hospital Discharge:** Generating owner instruction sheet and clearing bed.
14. **Surgery Workflow:** Pre-op checklist, anesthesia recording, and operative summary.
15. **Payment Processing:** Generating invoice and applying payment via simulated provider.
16. **Inventory Dispensing:** Deducting medication batches directly from signed prescription.
17. **RBAC Authorization:** Verifying Receptionist cannot sign prescription; Owner cannot edit diagnosis.
18. **Tenant Isolation:** Confirming cross-tenant data leakage is strictly prohibited across all views.

---

## 5. CI / CD Pipeline Automation

1. **Lint & Typecheck:** `tsc --noEmit` and ESLint checks on every pull request.
2. **Vitest Unit & Integration:** Run against ephemeral Postgres and Redis service containers.
3. **Playwright E2E:** Automated execution in headless Chromium/Firefox before any Coolify deployment.
