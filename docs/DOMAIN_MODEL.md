# VetOS — Domain Model Specification (`DOMAIN_MODEL.md`)

## 1. Domain Philosophy & Invariants

In **VetOS**, the fundamental domain invariant is:

> **THE PATIENT (ANIMAL) IS THE CENTRAL ENTITY OF THE PLATFORM.**
> All clinical encounters, diagnostics, surgical episodes, prescriptions, communications, and financial records must ultimately connect to the patient's longitudinal medical timeline.

---

## 2. Core Entity Hierarchy

```
Organization (Tenant)
  │
  ├── Branches (Locations)
  │     ├── Staff (Users with Role + Branch Assignment)
  │     ├── Rooms (Consultation, Operating Theaters, Grooming)
  │     ├── Medical Equipment (Ultrasound, X-Ray, Anesthesia Machine)
  │     ├── Hospitalization Beds (Cages, Kennels, Critical Care Units)
  │     └── Inventory Locations (Central Pharmacy, Branch Dispensary)
  │
  └── Tutors (Pet Owners / Guardians)
        │
        └── PatientTutors (Ownership & Authorized Guardianship)
              │
              └── Patient (The Animal Entity)
                    │
                    └── Longitudinal Medical Timeline (Append-Only Event Stream)
```

---

## 3. Detailed Entity Definitions

### 3.1 Tenancy & Organizational Structure

#### `Organization` (Tenant)
* Represents the top-level veterinary enterprise.
* Attributes: `id`, `name`, `slug`, `taxId`, `phone`, `email`, `logoUrl`, `status`, `activatedModules` (`ARRAY[ModuleKey]`), `createdAt`, `updatedAt`.
* Invariant: Can host one or multiple physical or mobile branches.

#### `Branch`
* Represents a physical clinic location or mobile unit.
* Attributes: `id`, `organizationId`, `name`, `code`, `address`, `city`, `phone`, `emergencyPhone`, `operatingHoursJson`, `is24Hours`, `createdAt`.

#### `User` & `Staff`
* Represents system users (staff and tutors).
* Attributes: `id`, `email`, `passwordHash`, `name`, `phone`, `role` (`UserRole`), `organizationId`, `status`.
* `StaffProfile`: Links to `User`. Attributes: `licenseNumber` (matrícula profesional), `specialties` (`ARRAY[Specialty]`), `workingScheduleJson`, `primaryBranchId`.

---

### 3.2 Tutors & Patients (The Core Patient Domain)

#### `Tutor` (Client / Pet Owner)
* Attributes: `id`, `organizationId`, `userId` (nullable if registered by staff before app onboarding), `fullName`, `identificationNumber` (DNI/Passport), `email`, `phone`, `alternatePhone`, `address`, `notes`, `balance` (saldo deudor/acreedor).

#### `Patient` (Animal)
* Attributes: `id`, `organizationId`, `name`, `speciesId`, `breedId`, `sex` (`MALE`, `FEMALE`, `UNKNOWN`), `birthDate`, `isBirthDateApproximate`, `weightKg`, `microchipNumber` (ISO 11784/11785), `neuteringStatus` (`INTACT`, `NEUTERED`, `UNKNOWN`), `photoUrl`, `allergies` (`ARRAY[String]`), `chronicConditions` (`ARRAY[String]`), `bloodType`, `status` (`ACTIVE`, `DECEASED`, `TRANSFERRED`).
* Invariant: Microchip uniqueness is enforced per organization.

#### `PatientTutor` (Association Entity)
* Enables multiple guardians (e.g. family members, co-owners).
* Attributes: `patientId`, `tutorId`, `relationshipType` (`PRIMARY_OWNER`, `CO_OWNER`, `AUTHORIZED_GUARDIAN`), `isFinanciallyResponsible`.

---

### 3.3 Longitudinal Medical Timeline

The timeline is an ordered collection of chronological events. Every clinical interaction produces one or more typed timeline entries.

#### `TimelineEvent`
* Attributes: `id`, `organizationId`, `patientId`, `eventType` (`CONSULTATION`, `VACCINATION`, `DEWORMING`, `PRESCRIPTION`, `LAB_ORDER`, `LAB_RESULT`, `IMAGING_STUDY`, `SURGERY`, `HOSPITALIZATION`, `NOTE`, `PAYMENT`, `DOCUMENT`), `eventId` (FK to the specific domain table), `eventDate`, `title`, `summary`, `createdById`, `isOwnerVisible`.

---

### 3.4 Clinical Consultation & Documentation

#### `Consultation`
* Attributes: `id`, `organizationId`, `branchId`, `patientId`, `veterinarianId`, `appointmentId` (nullable for walk-ins), `consultationDate`, `reason`, `anamnesis`, `weightKg`, `temperatureCelsius`, `heartRateBpm`, `respiratoryRateBpm`, `bodyConditionScore` (1-9 scale), `physicalExamNotes`, `symptomsJson`, `presumptiveDiagnosis`, `confirmedDiagnosis`, `treatmentPlan`, `recommendations`, `followUpDate`, `status` (`DRAFT`, `FINALIZED`, `AMENDED`).

#### `Prescription` & `PrescriptionItem`
* **Rule:** AI never autonomously prescribes. Every prescription requires human veterinarian signature.
* `Prescription`: `id`, `organizationId`, `patientId`, `veterinarianId`, `consultationId`, `issuedDate`, `status` (`ACTIVE`, `COMPLETED`, `DISCONTINUED`).
* `PrescriptionItem`: `prescriptionId`, `medicationName`, `activeIngredient`, `presentation`, `dosage`, `frequency`, `duration`, `instructions`, `inventoryItemId` (optional link to dispensary for automated stock deduction).

---

### 3.5 Preventive Medicine (Vaccination & Deworming)

#### `VaccinationRecord`
* Attributes: `id`, `organizationId`, `patientId`, `vaccineName`, `type` (`RABIES`, `CORE_PUPPY`, `FELINE_TRIPLE`, etc.), `dateAdministered`, `nextDueDate`, `batchNumber`, `expirationDate`, `veterinarianId`, `certificateNumber`.

#### `DewormingRecord`
* Attributes: `id`, `organizationId`, `patientId`, `productName`, `type` (`INTERNAL`, `EXTERNAL`, `BROAD_SPECTRUM`), `dateAdministered`, `nextDueDate`, `doseGiven`, `veterinarianId`.

---

### 3.6 Diagnostics (Laboratory & Diagnostic Imaging)

#### `LabOrder` & `LabResult`
* State Machine: `ORDERED` -> `SAMPLE_PENDING` -> `SAMPLE_COLLECTED` -> `PROCESSING` -> `RESULT_AVAILABLE` -> `REVIEWED`.
* `LabOrder`: `id`, `organizationId`, `patientId`, `veterinarianId`, `testCategory` (Hematology, Biochemistry, Urinalysis, Serology), `priority` (`ROUTINE`, `STAT`), `orderedDate`.
* `LabResult`: `id`, `labOrderId`, `resultsJson` (structured analyte values, reference intervals, units, flagged high/low), `reportFileUrl`, `reviewedById`, `reviewedDate`, `clinicalInterpretation`.

#### `ImagingOrder` & `ImagingStudy`
* Modalities: `X_RAY`, `ULTRASOUND`, `CT_SCAN`, `MRI`, `ENDOSCOPY`, `ECHOCARDIOGRAPHY`.
* State Machine: `REQUESTED` -> `SCHEDULED` -> `PERFORMED` -> `REPORT_PENDING` -> `REPORT_AVAILABLE` -> `REVIEWED`.
* `ImagingStudy`: `id`, `patientId`, `modality`, `regionExamined`, `findings`, `conclusion`, `radiologistNotes`, `fileUrls` (`ARRAY[String]`), `dicomStudyUid` (future PACS bridge).

---

### 3.7 Inpatient & Surgical Care

#### `Hospitalization`
* Attributes: `id`, `organizationId`, `branchId`, `patientId`, `assignedVeterinarianId`, `bedId`, `admissionDate`, `dischargeDate`, `admissionDiagnosis`, `clinicalStatus` (`CRITICAL`, `OBSERVATION`, `STABLE`, `READY_FOR_DISCHARGE`), `feedingInstructions`, `status` (`ADMITTED`, `DISCHARGED`, `TRANSFERRED`, `DECEASED`).

#### `ClinicalTask` (Scheduled Nursing Orders)
* Attributes: `id`, `hospitalizationId`, `taskType` (`MEDICATION`, `VITALS_CHECK`, `FEEDING`, `GLUCOSE_CURVE`, `WOUND_CARE`), `scheduledTime`, `status` (`PENDING`, `DONE`, `SKIPPED`, `DELAYED`), `performedById`, `performedAt`, `notes`.

#### `SurgeryEpisode`
* State Machine: `SURGERY_INDICATED` -> `PREOPERATIVE_TESTS` -> `ESTIMATE` -> `OWNER_APPROVAL` -> `SCHEDULED` -> `IN_SURGERY` -> `RECOVERY` -> `DISCHARGED`.
* Attributes: `id`, `patientId`, `procedureName`, `leadSurgeonId`, `anesthesiologistId`, `operatingRoomId`, `anesthesiaProtocolJson`, `operativeNotes`, `digitalConsentSigned`.

---

### 3.8 Resource-Aware Scheduling (Appointments & Live Queue)

#### `Appointment`
* Must balance 3 simultaneous constraints: **Specialist**, **Room**, and **Equipment**.
* Attributes: `id`, `organizationId`, `branchId`, `patientId`, `tutorId`, `serviceId`, `veterinarianId`, `roomId`, `equipmentId`, `startTime`, `endTime`, `status` (`REQUESTED`, `CONFIRMED`, `CHECKED_IN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW`), `urgencyLevel` (`ROUTINE`, `PRIORITY`, `EMERGENCY`).
* **Rule:** Urgencies are confirmed only by triage staff, never inferred autonomously.

#### `WaitingRoomQueue`
* Live tracking states: `ARRIVED` -> `WAITING` -> `IN_CONSULTATION` -> `LAB/IMAGING` -> `PAYMENT` -> `FINISHED`.

---

### 3.9 Pharmacy & Inventory Domain

#### `InventoryItem` & `InventoryBatch`
* Tracks SKU, category, current stock, minimum stock, purchase cost, selling price.
* `InventoryBatch`: `id`, `inventoryItemId`, `batchNumber`, `expirationDate`, `quantityRemaining`, `branchId`.
* `InventoryTransaction`: Append-only audit record for purchases, dispensing from prescriptions, damaged stock, transfers, or sales.

---

### 3.10 Billing & Financial Domain

#### `Invoice` & `Payment`
* `Invoice`: `id`, `organizationId`, `branchId`, `tutorId`, `patientId`, `itemsJson`, `subtotal`, `taxTotal`, `total`, `status` (`DRAFT`, `ISSUED`, `PAID`, `CANCELLED`).
* `Payment`: `id`, `invoiceId`, `amount`, `paymentMethod` (`CASH`, `CREDIT_CARD`, `MERCADO_PAGO`, `TRANSFER`), `transactionRef`, `status` (`PENDING`, `APPROVED`, `REFUNDED`).
