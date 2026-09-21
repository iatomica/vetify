# VetOS — Database Schema Specification (`DATABASE_SCHEMA.md`)

## 1. Schema Conventions & Design Standards

* **Engine:** PostgreSQL 16+
* **Primary Keys:** `UUIDv7` (chronologically sortable, preventing index fragmentation on time-series tables).
* **Multi-Tenancy:** Every tenant-bound table includes `organization_id UUID NOT NULL` indexed and linked to the `organizations` table.
* **Auditability:** Every mutable entity includes `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`, `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`, `deleted_at TIMESTAMP WITH TIME ZONE NULL` (soft delete), and `version INT DEFAULT 1` (optimistic concurrency control).
* **Search Acceleration:** GIN and B-Tree indexes on `microchip_number`, `phone`, `email`, and full-text `to_tsvector` for patient/tutor search.

---

## 2. Core Relational Schema (DDL)

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums
CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'BRANCH_MANAGER', 'VETERINARIAN',
  'SPECIALIST', 'VETERINARY_ASSISTANT', 'NURSE', 'RECEPTIONIST',
  'LAB_TECHNICIAN', 'PHARMACY_STAFF', 'CASHIER', 'PET_OWNER'
);

CREATE TYPE pet_species AS ENUM ('CANINE', 'FELINE', 'EQUINE', 'AVIAN', 'EXOTIC');
CREATE TYPE pet_sex AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
CREATE TYPE neutering_status AS ENUM ('INTACT', 'NEUTERED', 'UNKNOWN');

CREATE TYPE appointment_status AS ENUM (
  'REQUESTED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS',
  'COMPLETED', 'CANCELLED', 'NO_SHOW'
);

CREATE TYPE urgency_level AS ENUM ('ROUTINE', 'PRIORITY', 'EMERGENCY');

CREATE TYPE lab_order_status AS ENUM (
  'ORDERED', 'SAMPLE_PENDING', 'SAMPLE_COLLECTED',
  'PROCESSING', 'RESULT_AVAILABLE', 'REVIEWED'
);

CREATE TYPE imaging_status AS ENUM (
  'REQUESTED', 'SCHEDULED', 'PERFORMED',
  'REPORT_PENDING', 'REPORT_AVAILABLE', 'REVIEWED'
);

CREATE TYPE hospitalization_status AS ENUM (
  'ADMITTED', 'OBSERVATION', 'CRITICAL', 'DISCHARGED', 'DECEASED'
);

CREATE TYPE task_status AS ENUM ('PENDING', 'DONE', 'SKIPPED', 'DELAYED');

-- ============================================================================
-- 1. TENANCY & ACCESS CONTROL
-- ============================================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  tax_id VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  logo_url TEXT,
  activated_modules TEXT[] DEFAULT ARRAY['CORE', 'APPOINTMENTS', 'MEDICAL_RECORDS', 'VACCINATION', 'PHARMACY'],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  emergency_phone VARCHAR(50),
  is_24_hours BOOLEAN DEFAULT FALSE,
  operating_hours_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, code)
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  room_type VARCHAR(50) NOT NULL, -- CONSULTATION, SURGERY, IMAGING, LAB
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role user_role NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, email)
);

CREATE TABLE staff_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(100),
  specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  primary_branch_id UUID REFERENCES branches(id),
  schedule_config_json JSONB DEFAULT '{}'
);

-- ============================================================================
-- 2. PATIENT DOMAIN (CORE ENTITIES)
-- ============================================================================

CREATE TABLE tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  id_number VARCHAR(50), -- DNI / Passport
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  alternate_phone VARCHAR(50),
  address TEXT,
  balance_cents BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_tutors_org_search ON tutors(organization_id, phone, full_name);

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  species pet_species NOT NULL,
  breed VARCHAR(100) NOT NULL,
  sex pet_sex NOT NULL DEFAULT 'UNKNOWN',
  birth_date DATE,
  is_birth_date_approximate BOOLEAN DEFAULT FALSE,
  weight_kg NUMERIC(6, 3),
  microchip_number VARCHAR(50),
  neutering_status neutering_status NOT NULL DEFAULT 'UNKNOWN',
  photo_url TEXT,
  allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
  chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
  blood_type VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_patients_org_microchip ON patients(organization_id, microchip_number);
CREATE INDEX idx_patients_org_name ON patients(organization_id, name);

CREATE TABLE patient_tutors (
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT TRUE,
  relationship VARCHAR(50) DEFAULT 'PRIMARY_OWNER',
  is_financially_responsible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(patient_id, tutor_id)
);

-- ============================================================================
-- 3. LONGITUDINAL MEDICAL TIMELINE & CLINICAL RECORDS
-- ============================================================================

CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_id UUID NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  created_by_id UUID REFERENCES users(id),
  is_owner_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_patient_date ON timeline_events(patient_id, event_date DESC);
CREATE INDEX idx_timeline_org_patient_type ON timeline_events(organization_id, patient_id, event_type);

CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  veterinarian_id UUID NOT NULL REFERENCES users(id),
  consultation_date TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT NOT NULL,
  anamnesis TEXT,
  weight_kg NUMERIC(6,3),
  temp_celsius NUMERIC(4,1),
  heart_rate_bpm INT,
  respiratory_rate_bpm INT,
  physical_exam TEXT,
  presumptive_diagnosis TEXT,
  confirmed_diagnosis TEXT,
  treatment_plan TEXT,
  recommendations TEXT,
  follow_up_date DATE,
  status VARCHAR(30) DEFAULT 'FINALIZED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  veterinarian_id UUID NOT NULL REFERENCES users(id),
  consultation_id UUID REFERENCES consultations(id),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  instructions TEXT,
  is_dispensed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medication_name VARCHAR(255) NOT NULL,
  active_ingredient VARCHAR(255),
  presentation VARCHAR(100),
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  quantity_prescribed INT DEFAULT 1,
  quantity_dispensed INT DEFAULT 0
);

CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  veterinarian_id UUID NOT NULL REFERENCES users(id),
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_type VARCHAR(100) NOT NULL,
  date_administered DATE NOT NULL,
  next_due_date DATE NOT NULL,
  batch_number VARCHAR(100) NOT NULL,
  expiration_date DATE,
  certificate_number VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vaccinations_patient ON vaccinations(patient_id, date_administered DESC);
CREATE INDEX idx_vaccinations_due ON vaccinations(organization_id, next_due_date);

-- ============================================================================
-- 4. RESOURCE-AWARE APPOINTMENTS & LIVE QUEUE
-- ============================================================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  veterinarian_id UUID REFERENCES users(id),
  room_id UUID REFERENCES rooms(id),
  service_name VARCHAR(100) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status appointment_status DEFAULT 'REQUESTED',
  urgency_level urgency_level DEFAULT 'ROUTINE',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appts_vet_time ON appointments(veterinarian_id, start_time, end_time);
CREATE INDEX idx_appts_room_time ON appointments(room_id, start_time, end_time);
CREATE INDEX idx_appts_branch_date ON appointments(branch_id, start_time);

CREATE TABLE live_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id),
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  tutor_id UUID NOT NULL REFERENCES tutors(id),
  check_in_time TIMESTAMPTZ DEFAULT NOW(),
  queue_state VARCHAR(50) DEFAULT 'WAITING', -- WAITING, IN_CONSULTATION, LAB, PHARMACY, FINISHED
  assigned_vet_id UUID REFERENCES users(id),
  assigned_room_id UUID REFERENCES rooms(id),
  triage_notes TEXT,
  is_urgent BOOLEAN DEFAULT FALSE
);

-- ============================================================================
-- 5. DIAGNOSTICS (LABORATORY & IMAGING)
-- ============================================================================

CREATE TABLE lab_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  veterinarian_id UUID NOT NULL REFERENCES users(id),
  test_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  priority urgency_level DEFAULT 'ROUTINE',
  status lab_order_status DEFAULT 'ORDERED',
  ordered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_order_id UUID NOT NULL REFERENCES lab_orders(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES users(id),
  results_data JSONB NOT NULL,
  report_pdf_url TEXT,
  clinical_interpretation TEXT,
  reviewed_by_id UUID REFERENCES users(id),
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE imaging_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  veterinarian_id UUID NOT NULL REFERENCES users(id),
  modality VARCHAR(50) NOT NULL, -- X_RAY, ULTRASOUND, CT, MRI, ENDOSCOPY
  anatomical_region VARCHAR(100) NOT NULL,
  status imaging_status DEFAULT 'REQUESTED',
  findings TEXT,
  conclusion TEXT,
  file_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  dicom_study_uid VARCHAR(128),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. HOSPITALIZATION & SURGERY
-- ============================================================================

CREATE TABLE hospitalization_beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id),
  code VARCHAR(50) NOT NULL,
  bed_type VARCHAR(50) NOT NULL, -- CAGE_SMALL, KENNEL_LARGE, ICU_OXYGEN
  is_occupied BOOLEAN DEFAULT FALSE
);

CREATE TABLE hospitalizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  bed_id UUID REFERENCES hospitalization_beds(id),
  attending_vet_id UUID NOT NULL REFERENCES users(id),
  admission_date TIMESTAMPTZ DEFAULT NOW(),
  discharge_date TIMESTAMPTZ,
  admission_reason TEXT NOT NULL,
  clinical_status VARCHAR(50) DEFAULT 'STABLE',
  status hospitalization_status DEFAULT 'ADMITTED',
  feeding_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clinical_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospitalization_id UUID NOT NULL REFERENCES hospitalizations(id) ON DELETE CASCADE,
  task_type VARCHAR(50) NOT NULL, -- MEDICATION, VITALS, FEEDING, WOUND_CARE
  scheduled_time TIMESTAMPTZ NOT NULL,
  status task_status DEFAULT 'PENDING',
  administered_by_id UUID REFERENCES users(id),
  completed_at TIMESTAMPTZ,
  clinical_notes TEXT
);

-- ============================================================================
-- 7. PHARMACY, INVENTORY & PET SHOP
-- ============================================================================

CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- PHARMACY, SURGICAL_SUPPLY, CLINICAL_FOOD, ACCESSORY
  requires_prescription BOOLEAN DEFAULT FALSE,
  unit VARCHAR(50) NOT NULL,
  purchase_cost_cents INT NOT NULL,
  selling_price_cents INT NOT NULL,
  minimum_stock INT DEFAULT 5,
  current_stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(organization_id, sku)
);

CREATE TABLE inventory_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  batch_number VARCHAR(100) NOT NULL,
  expiration_date DATE NOT NULL,
  quantity_remaining INT NOT NULL,
  branch_id UUID NOT NULL REFERENCES branches(id)
);

CREATE TABLE inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  transaction_type VARCHAR(50) NOT NULL, -- PURCHASE, DISPENSE, ADJUSTMENT, SALE, RETURN
  quantity_delta INT NOT NULL,
  resulting_stock INT NOT NULL,
  reference_type VARCHAR(50), -- PRESCRIPTION, INVOICE, MANUAL
  reference_id UUID,
  performed_by_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. BILLING, PAYMENTS & AUDIT TRAIL
-- ============================================================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id),
  tutor_id UUID NOT NULL REFERENCES tutors(id),
  patient_id UUID REFERENCES patients(id),
  invoice_number VARCHAR(100) NOT NULL,
  subtotal_cents INT NOT NULL,
  tax_cents INT NOT NULL DEFAULT 0,
  total_cents INT NOT NULL,
  status VARCHAR(30) DEFAULT 'ISSUED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount_cents INT NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- CASH, CARD, MERCADO_PAGO, TRANSFER
  gateway_reference VARCHAR(255),
  status VARCHAR(30) DEFAULT 'APPROVED',
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  actor_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL, -- CREATE, READ, UPDATE, DELETE, DISPENSE, PRESCRIBE
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  diff_json JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_org_entity ON audit_logs(organization_id, entity_type, entity_id);
```
