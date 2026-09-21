// VetOS Pure Domain Definitions & Types

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ORGANIZATION_ADMIN'
  | 'BRANCH_MANAGER'
  | 'VETERINARIAN'
  | 'SPECIALIST'
  | 'VETERINARY_ASSISTANT'
  | 'NURSE'
  | 'RECEPTIONIST'
  | 'LAB_TECHNICIAN'
  | 'PHARMACY_STAFF'
  | 'CASHIER'
  | 'PET_OWNER';

export type PetSpecies = 'CANINE' | 'FELINE' | 'EQUINE' | 'AVIAN' | 'EXOTIC';
export type PetSex = 'MALE' | 'FEMALE' | 'UNKNOWN';
export type NeuteringStatus = 'INTACT' | 'NEUTERED' | 'UNKNOWN';

export type AppointmentStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type UrgencyLevel = 'ROUTINE' | 'PRIORITY' | 'EMERGENCY';

export type QueueState =
  | 'WAITING'
  | 'IN_CONSULTATION'
  | 'LAB_IMAGING'
  | 'PHARMACY'
  | 'PAYMENT'
  | 'FINISHED';

export type TimelineEventType =
  | 'CONSULTATION'
  | 'VACCINATION'
  | 'DEWORMING'
  | 'PRESCRIPTION'
  | 'LAB_ORDER'
  | 'LAB_RESULT'
  | 'IMAGING_STUDY'
  | 'SURGERY'
  | 'HOSPITALIZATION'
  | 'NOTE'
  | 'PAYMENT'
  | 'DOCUMENT';

export type HospitalizationStatus =
  | 'ADMITTED'
  | 'OBSERVATION'
  | 'CRITICAL'
  | 'READY_FOR_DISCHARGE'
  | 'DISCHARGED';

export type ClinicalTaskType =
  | 'MEDICATION'
  | 'VITALS_CHECK'
  | 'FEEDING'
  | 'GLUCOSE_CURVE'
  | 'WOUND_CARE';

export type TaskExecutionStatus = 'PENDING' | 'DONE' | 'SKIPPED' | 'DELAYED';

// Organization & Branch
export interface Organization {
  id: string;
  name: string;
  slug: string;
  taxId?: string;
  email: string;
  phone: string;
  logoUrl?: string;
  activatedModules: string[];
  createdAt: string;
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  emergencyPhone?: string;
  is24Hours: boolean;
}

export interface Room {
  id: string;
  organizationId: string;
  branchId: string;
  name: string;
  roomType: 'CONSULTATION' | 'SURGERY' | 'IMAGING' | 'LAB';
  isActive: boolean;
}

// User & Staff
export interface UserSession {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  branchId?: string;
  licenseNumber?: string;
  specialties?: string[];
}

// Tutor (Owner) & Patient (Animal)
export interface Tutor {
  id: string;
  organizationId: string;
  userId?: string;
  fullName: string;
  idNumber: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  balanceCents: number;
}

export interface Patient {
  id: string;
  organizationId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  sex: PetSex;
  birthDate?: string;
  isBirthDateApproximate?: boolean;
  weightKg: number;
  microchipNumber?: string;
  neuteringStatus: NeuteringStatus;
  photoUrl?: string;
  allergies: string[];
  chronicConditions: string[];
  bloodType?: string;
  isActive: boolean;
  primaryTutorId: string;
  tutorName: string;
  tutorPhone: string;
}

// Medical Timeline Event
export interface TimelineEvent {
  id: string;
  organizationId: string;
  patientId: string;
  eventType: TimelineEventType;
  eventId: string;
  eventDate: string;
  title: string;
  summary: string;
  createdById: string;
  createdByName: string;
  isOwnerVisible: boolean;
  metadata?: Record<string, any>;
}

// Consultation
export interface Consultation {
  id: string;
  organizationId: string;
  branchId: string;
  patientId: string;
  veterinarianId: string;
  veterinarianName: string;
  appointmentId?: string;
  consultationDate: string;
  reason: string;
  anamnesis: string;
  weightKg: number;
  tempCelsius: number;
  heartRateBpm: number;
  respiratoryRateBpm: number;
  physicalExamNotes: string;
  presumptiveDiagnosis: string;
  confirmedDiagnosis: string;
  treatmentPlan: string;
  recommendations: string;
  followUpDate?: string;
  status: 'DRAFT' | 'FINALIZED' | 'AMENDED';
}

// Prescription & Items
export interface PrescriptionItem {
  id: string;
  medicationName: string;
  activeIngredient?: string;
  presentation?: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantityPrescribed: number;
  quantityDispensed: number;
}

export interface Prescription {
  id: string;
  organizationId: string;
  patientId: string;
  veterinarianId: string;
  veterinarianName: string;
  consultationId?: string;
  issuedAt: string;
  instructions?: string;
  isDispensed: boolean;
  items: PrescriptionItem[];
}

// Vaccination Record
export interface VaccinationRecord {
  id: string;
  organizationId: string;
  patientId: string;
  veterinarianId: string;
  veterinarianName: string;
  vaccineName: string;
  vaccineType: string;
  dateAdministered: string;
  nextDueDate: string;
  batchNumber: string;
  expirationDate?: string;
  certificateNumber?: string;
}

// Appointments & Live Queue
export interface Appointment {
  id: string;
  organizationId: string;
  branchId: string;
  patientId: string;
  patientName: string;
  species: PetSpecies;
  tutorId: string;
  tutorName: string;
  tutorPhone: string;
  veterinarianId: string;
  veterinarianName: string;
  roomId?: string;
  roomName?: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  urgencyLevel: UrgencyLevel;
  notes?: string;
}

export interface LiveQueueEntry {
  id: string;
  organizationId: string;
  branchId: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  species: PetSpecies;
  breed: string;
  tutorName: string;
  tutorPhone: string;
  checkInTime: string;
  queueState: QueueState;
  assignedVetId?: string;
  assignedVetName?: string;
  assignedRoomId?: string;
  assignedRoomName?: string;
  triageNotes?: string;
  urgencyLevel: UrgencyLevel;
}

// Hospitalization & Inpatient Ward
export interface HospitalizationBed {
  id: string;
  organizationId: string;
  branchId: string;
  code: string;
  bedType: 'CAGE_SMALL' | 'KENNEL_LARGE' | 'ICU_OXYGEN';
  isOccupied: boolean;
}

export interface ClinicalTask {
  id: string;
  hospitalizationId: string;
  taskType: ClinicalTaskType;
  title: string;
  scheduledTime: string;
  status: TaskExecutionStatus;
  administeredById?: string;
  administeredByName?: string;
  completedAt?: string;
  notes?: string;
}

export interface HospitalizationEpisode {
  id: string;
  organizationId: string;
  branchId: string;
  patientId: string;
  patientName: string;
  species: PetSpecies;
  breed: string;
  bedCode: string;
  attendingVetId: string;
  attendingVetName: string;
  admissionDate: string;
  dischargeDate?: string;
  admissionReason: string;
  clinicalStatus: 'CRITICAL' | 'OBSERVATION' | 'STABLE' | 'READY_FOR_DISCHARGE';
  status: HospitalizationStatus;
  feedingInstructions: string;
  tasks: ClinicalTask[];
}

// Pharmacy & Inventory
export interface InventoryBatch {
  batchNumber: string;
  expirationDate: string;
  quantityRemaining: number;
}

export interface InventoryItem {
  id: string;
  organizationId: string;
  sku: string;
  name: string;
  brand: string;
  category: 'PHARMACY' | 'SURGICAL_SUPPLY' | 'CLINICAL_FOOD' | 'ACCESSORY';
  requiresPrescription: boolean;
  unit: string;
  purchaseCostCents: number;
  sellingPriceCents: number;
  minimumStock: number;
  currentStock: number;
  batches: InventoryBatch[];
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string;
  organizationId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'DISPENSE' | 'PRESCRIBE' | 'CHECK_IN' | 'TASK_EXECUTE';
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}
