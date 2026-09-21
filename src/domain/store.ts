// VetOS Multi-Tenant Mock & LocalStorage Store Service
// Mirrors PostgreSQL tables for high-fidelity client execution and testing

import type { 
  Organization, 
  Branch, 
  Room, 
  UserSession, 
  Tutor, 
  Patient, 
  TimelineEvent, 
  LiveQueueEntry, 
  HospitalizationEpisode
} from './types';

// Initial Organizations
export const SEED_ORGANIZATION: Organization = {
  id: 'org-vetify-hospital',
  name: 'Hospital Veterinario Central San Martín',
  slug: 'central-san-martin',
  taxId: '30-71829341-8',
  email: 'info@vetify-hospital.com',
  phone: '+54 11 4790-2200',
  logoUrl: '',
  activatedModules: [
    'CORE',
    'APPOINTMENTS',
    'MEDICAL_RECORDS',
    'TIMELINE',
    'VACCINATION',
    'PHARMACY',
    'HOSPITALIZATION',
    'LIVE_QUEUE'
  ],
  createdAt: '2025-01-10T08:00:00Z'
};

export const SEED_BRANCHES: Branch[] = [
  {
    id: 'branch-headquarters',
    organizationId: 'org-vetify-hospital',
    name: 'Sede Central & Hospital de Urgencias 24h',
    code: 'HQ-CENTRAL',
    address: 'Av. Libertador 2450',
    city: 'Buenos Aires',
    phone: '+54 11 4790-2200',
    emergencyPhone: '0800-888-VET',
    is24Hours: true
  },
  {
    id: 'branch-nordelta',
    organizationId: 'org-vetify-hospital',
    name: 'Sede Nordelta Consultorios & Especialidades',
    code: 'BR-NORDELTA',
    address: 'Av. de los Lagos 500',
    city: 'Tigre',
    phone: '+54 11 4790-2244',
    is24Hours: false
  }
];

export const SEED_ROOMS: Room[] = [
  {
    id: 'room-box-1',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters',
    name: 'Box 01 · Medicina Felina Fear-Free',
    roomType: 'CONSULTATION',
    isActive: true
  },
  {
    id: 'room-box-2',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters',
    name: 'Box 02 · Clínica Médica Canina',
    roomType: 'CONSULTATION',
    isActive: true
  },
  {
    id: 'room-or-1',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters',
    name: 'Quirófano A · Cirugía de Tejidos Blandos',
    roomType: 'SURGERY',
    isActive: true
  }
];

// Seed Users for all key operational roles
export const SEED_USERS: UserSession[] = [
  {
    userId: 'user-admin',
    email: 'valentina.rossi@vetify.com',
    fullName: 'Dra. Valentina Rossi',
    role: 'ORGANIZATION_ADMIN',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters',
    licenseNumber: 'MP 4821',
    specialties: ['Cirugía Suave', 'Medicina Felina Fear-Free']
  },
  {
    userId: 'user-vet-cardiologist',
    email: 'marcos.santos@vetify.com',
    fullName: 'Dr. Marcos Santos',
    role: 'SPECIALIST',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters',
    licenseNumber: 'MP 6109',
    specialties: ['Cardiología & Ecocardiografía Doppler']
  },
  {
    userId: 'user-reception',
    email: 'recepcion@vetify.com',
    fullName: 'Tomás Morales',
    role: 'RECEPTIONIST',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters'
  },
  {
    userId: 'user-nurse',
    email: 'enfermeria@vetify.com',
    fullName: 'Lic. Luciana Gómez',
    role: 'NURSE',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters'
  },
  {
    userId: 'user-pharmacy',
    email: 'farmacia@vetify.com',
    fullName: 'Farm. Javier Peralta',
    role: 'PHARMACY_STAFF',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters'
  },
  {
    userId: 'user-tutor-camila',
    email: 'camila.benitez@gmail.com',
    fullName: 'Camila Benítez',
    role: 'PET_OWNER',
    organizationId: 'org-vetify-hospital'
  }
];

// Seed Tutors
export const SEED_TUTORS: Tutor[] = [
  {
    id: 'tutor-camila',
    organizationId: 'org-vetify-hospital',
    userId: 'user-tutor-camila',
    fullName: 'Camila Benítez',
    idNumber: '34.891.220',
    email: 'camila.benitez@gmail.com',
    phone: '+54 9 11 5489-3210',
    alternatePhone: '+54 11 4098-1122 (Hermano)',
    address: 'Av. Libertador 2450, 4to B',
    balanceCents: 0
  },
  {
    id: 'tutor-alberto',
    organizationId: 'org-vetify-hospital',
    fullName: 'Dr. Alberto Gutiérrez',
    idNumber: '28.114.908',
    email: 'alberto.gutierrez@yahoo.com',
    phone: '+54 9 11 6721-0988',
    address: 'Calle Ombú 142',
    balanceCents: 0
  }
];

// Seed Patients (Animals)
export const SEED_PATIENTS: Patient[] = [
  {
    id: 'pet-milo',
    organizationId: 'org-vetify-hospital',
    name: 'Milo',
    species: 'CANINE',
    breed: 'Golden Retriever',
    sex: 'MALE',
    birthDate: '2022-03-15',
    weightKg: 31.8,
    microchipNumber: '981098107293841',
    neuteringStatus: 'NEUTERED',
    photoUrl: '/assets/doctor-exam.webp',
    allergies: ['Picadura de pulga (DAPP)', 'Pollo / Harinas procesadas'],
    chronicConditions: ['Displasia leve de cadera izquierda'],
    bloodType: 'DEA 1.1 Positivo',
    isActive: true,
    primaryTutorId: 'tutor-camila',
    tutorName: 'Camila Benítez',
    tutorPhone: '+54 9 11 5489-3210'
  },
  {
    id: 'pet-luna',
    organizationId: 'org-vetify-hospital',
    name: 'Luna',
    species: 'FELINE',
    breed: 'Siamés Tradicional',
    sex: 'FEMALE',
    birthDate: '2023-06-20',
    weightKg: 4.1,
    microchipNumber: '981098107293992',
    neuteringStatus: 'NEUTERED',
    photoUrl: '/assets/cat-care.webp',
    allergies: ['Cefalexina'],
    chronicConditions: ['Gingivoestomatitis crónica leve'],
    bloodType: 'Tipo A',
    isActive: true,
    primaryTutorId: 'tutor-camila',
    tutorName: 'Camila Benítez',
    tutorPhone: '+54 9 11 5489-3210'
  },
  {
    id: 'pet-rocky',
    organizationId: 'org-vetify-hospital',
    name: 'Rocky',
    species: 'CANINE',
    breed: 'Bulldog Francés',
    sex: 'MALE',
    birthDate: '2021-11-10',
    weightKg: 13.5,
    microchipNumber: '981098107291114',
    neuteringStatus: 'INTACT',
    photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80',
    allergies: ['Atopía estacional', 'Acaros del polvo'],
    chronicConditions: ['Síndrome Braquicefálico Obstructivo (BOAS) Grado I'],
    isActive: true,
    primaryTutorId: 'tutor-alberto',
    tutorName: 'Dr. Alberto Gutiérrez',
    tutorPhone: '+54 9 11 6721-0988'
  }
];

// Seed Longitudinal Timeline Events for Milo
export const SEED_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'tle-01',
    organizationId: 'org-vetify-hospital',
    patientId: 'pet-milo',
    eventType: 'CONSULTATION',
    eventId: 'cons-milo-01',
    eventDate: '2026-09-15T10:30:00Z',
    title: 'Consulta General & Traumatología Preventiva',
    summary: 'Evaluación de rangos articulares en tren posterior. Se constata marcha fluida con leve crepitación indolora.',
    createdById: 'user-admin',
    createdByName: 'Dra. Valentina Rossi (MP 4821)',
    isOwnerVisible: true,
    metadata: {
      temp: '38.4 °C',
      heartRate: '92 bpm',
      weight: '31.8 kg'
    }
  },
  {
    id: 'tle-02',
    organizationId: 'org-vetify-hospital',
    patientId: 'pet-milo',
    eventType: 'PRESCRIPTION',
    eventId: 'rx-milo-01',
    eventDate: '2026-09-15T11:00:00Z',
    title: 'Receta Médica Electrónica Homologada',
    summary: 'Cosequin Maximum Strength (1 comp/día c/desayuno por 60 días) + Alimento Royal Canin Gastrointestinal.',
    createdById: 'user-admin',
    createdByName: 'Dra. Valentina Rossi (MP 4821)',
    isOwnerVisible: true
  },
  {
    id: 'tle-03',
    organizationId: 'org-vetify-hospital',
    patientId: 'pet-milo',
    eventType: 'VACCINATION',
    eventId: 'vax-milo-01',
    eventDate: '2025-10-20T14:15:00Z',
    title: 'Inmunización Séxtuple Canina Anual',
    summary: 'Nobivac DHPPi + Lepto. Lote: N-84920. Revacunación programada para Octubre 2026.',
    createdById: 'user-admin',
    createdByName: 'Dra. Valentina Rossi (MP 4821)',
    isOwnerVisible: true
  },
  {
    id: 'tle-04',
    organizationId: 'org-vetify-hospital',
    patientId: 'pet-milo',
    eventType: 'LAB_RESULT',
    eventId: 'lab-milo-01',
    eventDate: '2026-07-10T16:00:00Z',
    title: 'Perfil Bioquímico & Hematológico Rutinario',
    summary: 'Glucemia: 94 mg/dL · Creatinina: 1.1 mg/dL · ALT: 38 UI/L. Todos los analitos dentro del intervalo de referencia.',
    createdById: 'user-vet-cardiologist',
    createdByName: 'Dr. Marcos Santos',
    isOwnerVisible: true
  }
];

// Seed Live Queue Entries
export const SEED_QUEUE: LiveQueueEntry[] = [
  {
    id: 'q-01',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters',
    appointmentId: 'apt-01',
    patientId: 'pet-milo',
    patientName: 'Milo',
    species: 'CANINE',
    breed: 'Golden Retriever',
    tutorName: 'Camila Benítez',
    tutorPhone: '+54 9 11 5489-3210',
    checkInTime: '2026-09-21T16:40:00Z',
    queueState: 'WAITING',
    assignedVetId: 'user-admin',
    assignedVetName: 'Dra. Valentina Rossi',
    assignedRoomId: 'room-box-2',
    assignedRoomName: 'Box 02 · Clínica Médica Canina',
    triageNotes: 'Refuerzo de vacuna séxtuple + revisión preventiva de marcha.',
    urgencyLevel: 'ROUTINE'
  },
  {
    id: 'q-02',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters',
    patientId: 'pet-rocky',
    patientName: 'Rocky',
    species: 'CANINE',
    breed: 'Bulldog Francés',
    tutorName: 'Dr. Alberto Gutiérrez',
    tutorPhone: '+54 9 11 6721-0988',
    checkInTime: '2026-09-21T16:50:00Z',
    queueState: 'IN_CONSULTATION',
    assignedVetId: 'user-admin',
    assignedVetName: 'Dra. Valentina Rossi',
    assignedRoomId: 'room-box-1',
    assignedRoomName: 'Box 01 · Medicina Felina Fear-Free',
    triageNotes: 'Control por erupción en pliegues nasales.',
    urgencyLevel: 'PRIORITY'
  }
];

// Seed Hospitalization Episodes
export const SEED_HOSPITALIZATION: HospitalizationEpisode[] = [
  {
    id: 'hosp-01',
    organizationId: 'org-vetify-hospital',
    branchId: 'branch-headquarters',
    patientId: 'pet-rocky',
    patientName: 'Rocky',
    species: 'CANINE',
    breed: 'Bulldog Francés',
    bedCode: 'ICU-02 (Oxígeno)',
    attendingVetId: 'user-admin',
    attendingVetName: 'Dra. Valentina Rossi',
    admissionDate: '2026-09-21T12:00:00Z',
    admissionReason: 'Cuadro de golpe de calor leve y dificultad respiratoria braquicefálica aguda.',
    clinicalStatus: 'OBSERVATION',
    status: 'ADMITTED',
    feedingInstructions: 'Ayuno sólido. Agua tibia ad libitum con electrolitos.',
    tasks: [
      {
        id: 'task-01',
        hospitalizationId: 'hosp-01',
        taskType: 'MEDICATION',
        title: 'Dexametasona 0.2mg/kg IV lento',
        scheduledTime: '18:00',
        status: 'PENDING'
      },
      {
        id: 'task-02',
        hospitalizationId: 'hosp-01',
        taskType: 'VITALS_CHECK',
        title: 'Temperatura rectal & Auscultación torácica',
        scheduledTime: '17:00',
        status: 'DONE',
        administeredByName: 'Lic. Luciana Gómez',
        completedAt: '2026-09-21T17:05:00Z',
        notes: 'Temp: 38.8°C. Murmullo vesicular normal sin estertores.'
      },
      {
        id: 'task-03',
        hospitalizationId: 'hosp-01',
        taskType: 'WOUND_CARE',
        title: 'Limpieza de pliegues nasales con Clorexyderm 4%',
        scheduledTime: '20:00',
        status: 'PENDING'
      }
    ]
  }
];

// VetOS Local Data Manager with LocalStorage persistence
export const VetOSStorage = {
  getPatients(): Patient[] {
    const raw = localStorage.getItem('vetos_patients');
    return raw ? JSON.parse(raw) : SEED_PATIENTS;
  },
  savePatients(patients: Patient[]) {
    localStorage.setItem('vetos_patients', JSON.stringify(patients));
  },
  addPatient(patient: Patient) {
    const list = this.getPatients();
    this.savePatients([patient, ...list]);
  },

  getTimelineEvents(patientId: string): TimelineEvent[] {
    const raw = localStorage.getItem(`vetos_timeline_${patientId}`);
    if (raw) return JSON.parse(raw);
    return SEED_TIMELINE_EVENTS.filter(e => e.patientId === patientId);
  },
  saveTimelineEvents(patientId: string, events: TimelineEvent[]) {
    localStorage.setItem(`vetos_timeline_${patientId}`, JSON.stringify(events));
  },
  addTimelineEvent(event: TimelineEvent) {
    const list = this.getTimelineEvents(event.patientId);
    this.saveTimelineEvents(event.patientId, [event, ...list]);
  },

  getQueue(): LiveQueueEntry[] {
    const raw = localStorage.getItem('vetos_queue');
    return raw ? JSON.parse(raw) : SEED_QUEUE;
  },
  saveQueue(queue: LiveQueueEntry[]) {
    localStorage.setItem('vetos_queue', JSON.stringify(queue));
  },
  updateQueueState(id: string, state: LiveQueueEntry['queueState']) {
    const list = this.getQueue();
    const updated = list.map(item => item.id === id ? { ...item, queueState: state } : item);
    this.saveQueue(updated);
  },

  getHospitalization(): HospitalizationEpisode[] {
    const raw = localStorage.getItem('vetos_hospitalization');
    return raw ? JSON.parse(raw) : SEED_HOSPITALIZATION;
  },
  saveHospitalization(episodes: HospitalizationEpisode[]) {
    localStorage.setItem('vetos_hospitalization', JSON.stringify(episodes));
  },
  updateTaskStatus(hospId: string, taskId: string, status: 'DONE' | 'SKIPPED' | 'DELAYED', notes?: string) {
    const list = this.getHospitalization();
    const updated = list.map(ep => {
      if (ep.id === hospId) {
        return {
          ...ep,
          tasks: ep.tasks.map(t => t.id === taskId ? {
            ...t,
            status,
            notes: notes || t.notes,
            completedAt: new Date().toISOString(),
            administeredByName: 'Personal de Enfermería'
          } : t)
        };
      }
      return ep;
    });
    this.saveHospitalization(updated);
  },

  resetAll() {
    localStorage.removeItem('vetos_patients');
    localStorage.removeItem('vetos_queue');
    localStorage.removeItem('vetos_hospitalization');
    localStorage.removeItem('vetos_timeline_pet-milo');
    localStorage.removeItem('vetos_timeline_pet-luna');
    localStorage.removeItem('vetos_timeline_pet-rocky');
  }
};
