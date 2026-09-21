export type UserRole = 'admin' | 'reception' | 'client' | 'hospitalization' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'reception' | 'client' | 'hospitalization';
  title?: string;
  avatarUrl?: string;
  ownerId?: string; // If role is 'client'
}

export type PetSpecies = 'Canino' | 'Felino' | 'Exótico';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  gender: 'Macho' | 'Hembra';
  birthDate: string;
  ageYears: number;
  weightKg: number;
  microchipNumber: string;
  photoUrl: string;
  ownerId: string;
  ownerName: string;
  allergies: string[];
  chronicConditions: string[];
  isNeutered: boolean;
}

export interface Owner {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  petIds: string[];
}

export type VaccineStatus = 'Vigente' | 'Próxima a vencer' | 'Vencida';

export interface VaccineRecord {
  id: string;
  petId: string;
  vaccineName: string;
  type: string;
  dateAdministered: string;
  nextDueDate: string;
  batchNumber: string;
  veterinarianName: string;
  licenseNumber: string;
  status: VaccineStatus;
}

export interface DewormingRecord {
  id: string;
  petId: string;
  product: string;
  type: 'Interna' | 'Externa' | 'Integral';
  dateAdministered: string;
  nextDueDate: string;
  weightAtAdminKg: number;
  veterinarianName: string;
}

export interface VitalSigns {
  tempCelsius: number;
  heartRateBpm: number;
  weightKg: number;
}

export interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface ConsultationRecord {
  id: string;
  petId: string;
  date: string;
  reason: string;
  anamnesis: string;
  diagnosis: string;
  treatment: string;
  vitalSigns: VitalSigns;
  prescriptions: Prescription[];
  veterinarianName: string;
  followUpDate?: string;
}

export type AppointmentStatus = 'Confirmado' | 'En espera' | 'En consulta' | 'Completado' | 'Cancelado';

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  species: PetSpecies;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  date: string;
  time: string;
  reason: string;
  veterinarianName: string;
  status: AppointmentStatus;
  notes?: string;
  urgencyLevel?: 'Normal' | 'Prioritario' | 'Urgencia';
}

export type ProductCategory = 'todos' | 'alimentos' | 'farmacia' | 'accesorios';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'alimentos' | 'farmacia' | 'accesorios';
  price: number;
  originalPrice?: number;
  description: string;
  badge?: string;
  requiresPrescription: boolean;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  unit: string;
  suitableFor: 'Canino' | 'Felino' | 'Ambos';
  composition?: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  shippingMethod: 'pickup' | 'delivery';
  recipientName: string;
  recipientPhone: string;
  address?: string;
  petName?: string;
  prescriptionVerified: boolean;
}
