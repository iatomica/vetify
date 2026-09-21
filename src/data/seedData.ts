import type { User, Pet, Owner, VaccineRecord, DewormingRecord, ConsultationRecord, Appointment, Product, CartItem, Order } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Dra. Valentina Rossi',
    email: 'valentina.rossi@vetify.com',
    role: 'admin',
    title: 'Directora Médica & Especialista en Cirugía Suave (MP 4821)',
    avatarUrl: '/assets/doctor-exam.webp'
  },
  {
    id: 'user-reception',
    name: 'Tomás Morales',
    email: 'recepcion@vetify.com',
    role: 'reception',
    title: 'Coordinador de Admisión & Turnos Clínicos',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-client',
    name: 'Camila Benítez',
    email: 'camila.benitez@gmail.com',
    role: 'client',
    title: 'Tutora de Milo (Golden) y Luna (Siamés)',
    ownerId: 'owner-camila',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-nurse',
    name: 'Lic. Luciana Gómez',
    email: 'enfermeria@vetify.com',
    role: 'hospitalization',
    title: 'Coordinadora de Cuidados Críticos & Rondas de Tareas',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_OWNERS: Owner[] = [
  {
    id: 'owner-camila',
    fullName: 'Camila Benítez',
    email: 'camila.benitez@gmail.com',
    phone: '+54 9 11 5489-3210',
    address: 'Av. Libertador 2450, 4to B',
    emergencyContact: 'Martín Benítez (Hermano) · 11-4098-1122',
    petIds: ['pet-milo', 'pet-luna']
  },
  {
    id: 'owner-alberto',
    fullName: 'Dr. Alberto Gutiérrez',
    email: 'alberto.gutierrez@yahoo.com',
    phone: '+54 9 11 6721-0988',
    address: 'Calle Ombú 142',
    emergencyContact: 'Sofía Gutiérrez · 11-3312-9900',
    petIds: ['pet-rocky']
  },
  {
    id: 'owner-lucia',
    fullName: 'Lucía Santillán',
    email: 'lucia.santillan@gmail.com',
    phone: '+54 9 11 8830-4412',
    address: 'Boulevard del Sol 980',
    emergencyContact: 'Horacio Santillán · 11-5544-7788',
    petIds: ['pet-bella']
  }
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-milo',
    name: 'Milo',
    species: 'Canino',
    breed: 'Golden Retriever',
    gender: 'Macho',
    birthDate: '2023-04-12',
    ageYears: 3,
    weightKg: 31.8,
    microchipNumber: '981098107293841',
    photoUrl: '/assets/doctor-exam.webp',
    ownerId: 'owner-camila',
    ownerName: 'Camila Benítez',
    allergies: ['Dermatitis por picadura de pulga (DAPP)'],
    chronicConditions: [],
    isNeutered: true
  },
  {
    id: 'pet-luna',
    name: 'Luna',
    species: 'Felino',
    breed: 'Siamés Tradicional',
    gender: 'Hembra',
    birthDate: '2024-01-20',
    ageYears: 2,
    weightKg: 3.9,
    microchipNumber: '981098109403812',
    photoUrl: '/assets/cat-care.webp',
    ownerId: 'owner-camila',
    ownerName: 'Camila Benítez',
    allergies: [],
    chronicConditions: ['Sensibilidad digestiva leve'],
    isNeutered: true
  },
  {
    id: 'pet-rocky',
    name: 'Rocky',
    species: 'Canino',
    breed: 'Bulldog Francés',
    gender: 'Macho',
    birthDate: '2022-08-05',
    ageYears: 4,
    weightKg: 12.6,
    microchipNumber: '981098101188304',
    photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80',
    ownerId: 'owner-alberto',
    ownerName: 'Alberto Gutiérrez',
    allergies: ['Polen ambiental', 'Hipersensibilidad a proteína de pollo'],
    chronicConditions: ['Síndrome braquiocefálico leve'],
    isNeutered: false
  },
  {
    id: 'pet-bella',
    name: 'Bella',
    species: 'Canino',
    breed: 'Border Collie',
    gender: 'Hembra',
    birthDate: '2023-11-10',
    ageYears: 2,
    weightKg: 19.2,
    microchipNumber: '981098105577209',
    photoUrl: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=500&auto=format&fit=crop&q=80',
    ownerId: 'owner-lucia',
    ownerName: 'Lucía Santillán',
    allergies: [],
    chronicConditions: [],
    isNeutered: true
  }
];

export const INITIAL_VACCINES: VaccineRecord[] = [
  // Milo (Golden Retriever)
  {
    id: 'vac-milo-1',
    petId: 'pet-milo',
    vaccineName: 'Séxtuple Canina (DHPPiL)',
    type: 'Canina Principal',
    dateAdministered: '2026-03-10',
    nextDueDate: '2027-03-10',
    batchNumber: 'VXZ-2026-09A',
    veterinarianName: 'Dra. Valentina Rossi',
    licenseNumber: 'MP 4821',
    status: 'Vigente'
  },
  {
    id: 'vac-milo-2',
    petId: 'pet-milo',
    vaccineName: 'Antirrábica Monovalente',
    type: 'Rabia Obligatoria',
    dateAdministered: '2025-10-15',
    nextDueDate: '2026-10-15',
    batchNumber: 'RAB-8841-B',
    veterinarianName: 'Dr. Lucas Varela',
    licenseNumber: 'MP 5104',
    status: 'Próxima a vencer'
  },
  {
    id: 'vac-milo-3',
    petId: 'pet-milo',
    vaccineName: 'KC Tos de las Perreras (Bordetella)',
    type: 'Respiratoria Canina',
    dateAdministered: '2026-01-20',
    nextDueDate: '2027-01-20',
    batchNumber: 'BORD-990-2',
    veterinarianName: 'Dra. Valentina Rossi',
    licenseNumber: 'MP 4821',
    status: 'Vigente'
  },

  // Luna (Gata Siamés)
  {
    id: 'vac-luna-1',
    petId: 'pet-luna',
    vaccineName: 'Triple Felina (FVRCP)',
    type: 'Felina Esencial',
    dateAdministered: '2026-02-18',
    nextDueDate: '2027-02-18',
    batchNumber: 'FEL-4029-C',
    veterinarianName: 'Dra. Valentina Rossi',
    licenseNumber: 'MP 4821',
    status: 'Vigente'
  },
  {
    id: 'vac-luna-2',
    petId: 'pet-luna',
    vaccineName: 'Leucemia Viral Felina (FeLV)',
    type: 'Felina Preventiva',
    dateAdministered: '2026-02-18',
    nextDueDate: '2027-02-18',
    batchNumber: 'FELV-880-1',
    veterinarianName: 'Dra. Valentina Rossi',
    licenseNumber: 'MP 4821',
    status: 'Vigente'
  },
  {
    id: 'vac-luna-3',
    petId: 'pet-luna',
    vaccineName: 'Antirrábica Felina',
    type: 'Rabia Obligatoria',
    dateAdministered: '2025-08-10',
    nextDueDate: '2026-08-10',
    batchNumber: 'RAB-102-F',
    veterinarianName: 'Dr. Lucas Varela',
    licenseNumber: 'MP 5104',
    status: 'Vencida'
  },

  // Rocky
  {
    id: 'vac-rocky-1',
    petId: 'pet-rocky',
    vaccineName: 'Séxtuple Canina (DHPPiL)',
    type: 'Canina Principal',
    dateAdministered: '2026-04-05',
    nextDueDate: '2027-04-05',
    batchNumber: 'VXZ-441-A',
    veterinarianName: 'Dra. Valentina Rossi',
    licenseNumber: 'MP 4821',
    status: 'Vigente'
  }
];

export const INITIAL_DEWORMINGS: DewormingRecord[] = [
  {
    id: 'dew-milo-1',
    petId: 'pet-milo',
    product: 'NexGard Spectra (30.1 - 60 kg)',
    type: 'Integral',
    dateAdministered: '2026-08-15',
    nextDueDate: '2026-09-15',
    weightAtAdminKg: 31.8,
    veterinarianName: 'Dra. Valentina Rossi'
  },
  {
    id: 'dew-milo-2',
    petId: 'pet-milo',
    product: 'Bravecto Masticable 12 Semanas',
    type: 'Externa',
    dateAdministered: '2026-06-10',
    nextDueDate: '2026-09-10',
    weightAtAdminKg: 31.5,
    veterinarianName: 'Dr. Lucas Varela'
  },
  {
    id: 'dew-luna-1',
    petId: 'pet-luna',
    product: 'Revolution Plus Gatos (2.5 - 5 kg)',
    type: 'Integral',
    dateAdministered: '2026-09-01',
    nextDueDate: '2026-10-01',
    weightAtAdminKg: 3.9,
    veterinarianName: 'Dra. Valentina Rossi'
  }
];

export const INITIAL_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'cons-milo-1',
    petId: 'pet-milo',
    date: '2026-08-20',
    reason: 'Chequeo preventivo anual & Limpieza dental profiláctica',
    anamnesis: 'Tutor refiere apetito normal y excelente nivel de energía. Ligera presencia de sarro en molares superiores.',
    diagnosis: 'Excelente estado general. Gingivitis grado 1 incipiente. Sin soplos cardíacos audibles.',
    treatment: 'Limpieza dental ultrasónica programada. Se indica pasta enzimática y cepillado 3 veces por semana.',
    vitalSigns: {
      tempCelsius: 38.4,
      heartRateBpm: 92,
      weightKg: 31.8
    },
    prescriptions: [
      {
        medication: 'Dentisept Pasta Dental Enzimática',
        dosage: '1 aplicación en encías y molares',
        frequency: 'Cada 48 horas post cena',
        duration: 'Continuo'
      },
      {
        medication: 'Omega 3 EPA/DHA Premium',
        dosage: '1 cápsula de 1000 mg',
        frequency: '1 vez al día con alimento',
        duration: '60 días'
      }
    ],
    veterinarianName: 'Dra. Valentina Rossi',
    followUpDate: '2027-02-20'
  },
  {
    id: 'cons-luna-1',
    petId: 'pet-luna',
    date: '2026-07-14',
    reason: 'Control de peso y descarte de bola de pelos',
    anamnesis: 'Episodio aislado de regurgitación de pelos hace 3 días. Comportamiento y micción normales.',
    diagnosis: 'Tricobezoar gástrico menor resuelto espontáneamente. Auscultación pulmonar límpida.',
    treatment: 'Se prescribe malta felina saborizada y aumento de hidratación.',
    vitalSigns: {
      tempCelsius: 38.6,
      heartRateBpm: 145,
      weightKg: 3.9
    },
    prescriptions: [
      {
        medication: 'Pasta de Malta Felina Laxatone',
        dosage: '2 cm de pasta',
        frequency: '2 veces por semana',
        duration: 'Continuo durante muda de pelo'
      }
    ],
    veterinarianName: 'Dra. Valentina Rossi'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    petId: 'pet-milo',
    petName: 'Milo',
    species: 'Canino',
    ownerId: 'owner-camila',
    ownerName: 'Camila Benítez',
    ownerPhone: '+54 9 11 5489-3210',
    date: '2026-09-22',
    time: '09:30',
    reason: 'Refuerzo de Vacuna Antirrábica & Evaluación de peso',
    veterinarianName: 'Dra. Valentina Rossi',
    status: 'Confirmado',
    urgencyLevel: 'Normal',
    notes: 'Paciente tranquilo y muy amigable'
  },
  {
    id: 'apt-2',
    petId: 'pet-rocky',
    petName: 'Rocky',
    species: 'Canino',
    ownerId: 'owner-alberto',
    ownerName: 'Alberto Gutiérrez',
    ownerPhone: '+54 9 11 6721-0988',
    date: '2026-09-21',
    time: '11:00',
    reason: 'Control dermatológico por erupción en pliegues nasales',
    veterinarianName: 'Dra. Valentina Rossi',
    status: 'En espera',
    urgencyLevel: 'Normal',
    notes: 'Llegó a sala de espera. Trae collar isabelino'
  },
  {
    id: 'apt-3',
    petId: 'pet-luna',
    petName: 'Luna',
    species: 'Felino',
    ownerId: 'owner-camila',
    ownerName: 'Camila Benítez',
    ownerPhone: '+54 9 11 5489-3210',
    date: '2026-09-21',
    time: '12:15',
    reason: 'Vacunación Antirrábica Felina anual',
    veterinarianName: 'Dra. Valentina Rossi',
    status: 'En consulta',
    urgencyLevel: 'Normal'
  },
  {
    id: 'apt-4',
    petId: 'pet-bella',
    petName: 'Bella',
    species: 'Canino',
    ownerId: 'owner-lucia',
    ownerName: 'Lucía Santillán',
    ownerPhone: '+54 9 11 8830-4412',
    date: '2026-09-21',
    time: '14:45',
    reason: 'Revisión traumatológica post-salto en agility',
    veterinarianName: 'Dr. Lucas Varela',
    status: 'Confirmado',
    urgencyLevel: 'Prioritario'
  }
];

export const seedUsers = DEMO_USERS;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-rc-gastro',
    name: 'Gastrointestinal Canine Veterinary Diet',
    brand: 'Royal Canin Clinical',
    category: 'alimentos',
    price: 74.50,
    originalPrice: 82.00,
    description: 'Fórmula de alta digestibilidad con prebióticos específicos para perros con trastornos digestivos agudos y convalecencia.',
    badge: 'Dieta Clínica',
    requiresPrescription: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 38,
    unit: 'Bolsa 10 kg',
    suitableFor: 'Canino',
    composition: 'Proteínas deshidratadas de ave, arroz, grasas animales, pulpa de remolacha, aceite de pescado y zeolita.',
    imageUrl: '/assets/products/rc-gastro.webp'
  },
  {
    id: 'prod-hills-kd',
    name: 'Prescription Diet k/d Feline Renal Health',
    brand: "Hill's Pet Nutrition",
    category: 'alimentos',
    price: 52.00,
    description: 'Nutrición clínicamente probada para proteger la función renal vital, estimular el apetito y mantener la masa muscular en gatos.',
    badge: 'Protección Renal',
    requiresPrescription: true,
    inStock: true,
    rating: 4.8,
    reviewsCount: 29,
    unit: 'Bolsa 3.8 kg',
    suitableFor: 'Felino',
    composition: 'Fósforo controlado, bajo sodio, niveles terapéuticos de ácidos grasos omega-3 y tecnología ActivBiome+ Kidney Defense.',
    imageUrl: '/assets/products/hills-kd.webp'
  },
  {
    id: 'prod-farmina-nd',
    name: 'N&D Quinoa Skin & Coat Arenque & Coco',
    brand: 'Farmina Grain-Free',
    category: 'alimentos',
    price: 46.00,
    originalPrice: 51.00,
    description: 'Alimento dietético completo para felinos con sensibilidad dérmica o intolerancia a ingredientes comunes. 92% proteína de origen animal.',
    badge: 'Hipoalergénico',
    requiresPrescription: false,
    inStock: true,
    rating: 4.9,
    reviewsCount: 44,
    unit: 'Bolsa 5 kg',
    suitableFor: 'Felino',
    composition: 'Arenque salvaje fresco, quinoa orgánica, coco desecado, cúrcuma y aceite de linaza.',
    imageUrl: '/assets/products/farmina-nd.webp'
  },
  {
    id: 'prod-bravecto',
    name: 'Bravecto Comprimido Masticable (10 a 20 kg)',
    brand: 'MSD Animal Health',
    category: 'farmacia',
    price: 38.90,
    description: 'Protección sistémica continua de 12 semanas completas contra pulgas y garrapatas. Altamente palatable y resistente al agua.',
    badge: 'Protección 12 Semanas',
    requiresPrescription: false,
    inStock: true,
    rating: 5.0,
    reviewsCount: 112,
    unit: '1 Comprimido masticable',
    suitableFor: 'Canino',
    imageUrl: '/assets/products/bravecto.webp'
  },
  {
    id: 'prod-nexgard',
    name: 'NexGard Spectra (7.5 a 15 kg)',
    brand: 'Boehringer Ingelheim',
    category: 'farmacia',
    price: 41.20,
    description: 'Antiparasitario de amplio espectro: elimina pulgas, garrapatas, ácaros de la sarna y parásitos gastrointestinales con una sola dosis mensual.',
    badge: 'Amplio Espectro',
    requiresPrescription: false,
    inStock: true,
    rating: 4.9,
    reviewsCount: 87,
    unit: 'Caja 3 Tabletas sabor carne',
    suitableFor: 'Canino',
    imageUrl: '/assets/products/nexgard.webp'
  },
  {
    id: 'prod-cosequin',
    name: 'Cosequin Maximum Strength Plus MSM',
    brand: 'Nutramax Laboratories',
    category: 'farmacia',
    price: 58.00,
    originalPrice: 66.00,
    description: 'Suplemento articular veterinario número 1 recomendado por traumatólogos. Glucosamina clorhidrato, condroitín sulfato y metilsulfonilmetano.',
    badge: 'Salud Articular',
    requiresPrescription: false,
    inStock: true,
    rating: 4.9,
    reviewsCount: 63,
    unit: 'Frasco 132 comprimidos masticables',
    suitableFor: 'Ambos',
    imageUrl: '/assets/products/cosequin.webp'
  },
  {
    id: 'prod-clorexyderm',
    name: 'Clorexyderm Espuma Antiséptica 4%',
    brand: 'ICF Dermatología Veterinaria',
    category: 'farmacia',
    price: 26.50,
    description: 'Espuma dermatológica sin aclarado con clorhexidina digluconato para el control de piodermas bacterianas y malassezia en pliegues cutáneos.',
    badge: 'Dermatológico',
    requiresPrescription: false,
    inStock: true,
    rating: 4.7,
    reviewsCount: 19,
    unit: 'Frasco con aplicador 200 ml',
    suitableFor: 'Ambos',
    imageUrl: '/assets/products/clorexyderm.webp'
  },
  {
    id: 'prod-ruffwear-harness',
    name: 'Arnés Front Range Ergonómico Ortopédico',
    brand: 'Ruffwear Performance',
    category: 'accesorios',
    price: 48.00,
    description: 'Diseño anatómico con doble punto de enganche (espalda y pecho antitirones). No comprime la tráquea ni restringe la escápula canina.',
    badge: 'Biomecánica Preventiva',
    requiresPrescription: false,
    inStock: true,
    rating: 4.9,
    reviewsCount: 52,
    unit: 'Talla M (Ajustable)',
    suitableFor: 'Canino',
    imageUrl: '/assets/products/ruffwear-harness.webp'
  },
  {
    id: 'prod-ceramic-bowl',
    name: 'Comedero Antivoracidad Cerámica Nórdica',
    brand: 'Vetify Essentials',
    category: 'accesorios',
    price: 29.00,
    description: 'Laberinto cerámico esmaltado de alta inercia térmica. Previene la aerofagia, dilatación gástrica y reduce el estrés digestivo un 400%.',
    badge: 'Diseño Clínico',
    requiresPrescription: false,
    inStock: true,
    rating: 4.8,
    reviewsCount: 31,
    unit: 'Diámetro 22 cm · Cerámica pesada',
    suitableFor: 'Ambos',
    imageUrl: '/assets/products/ceramic-bowl.webp'
  },
  {
    id: 'prod-iata-carrier',
    name: 'Transportadora Skudo IATA Certificada',
    brand: 'MPS Pet Safe',
    category: 'accesorios',
    price: 64.00,
    originalPrice: 72.00,
    description: 'Transportadora rígida homologada con cerradura de seguridad multipunto, ventilación perimetral 360° y esterilla higiénica drenante.',
    badge: 'Normativa IATA',
    requiresPrescription: false,
    inStock: true,
    rating: 4.9,
    reviewsCount: 26,
    unit: 'Medida 60 x 40 x 39 cm',
    suitableFor: 'Ambos',
    imageUrl: '/assets/products/iata-carrier.webp'
  }
];

// Helper to access / persist state in LocalStorage
export const StorageService = {
  getPets(): Pet[] {
    const raw = localStorage.getItem('vetify_pets');
    return raw ? JSON.parse(raw) : INITIAL_PETS;
  },
  savePets(pets: Pet[]) {
    localStorage.setItem('vetify_pets', JSON.stringify(pets));
  },
  addPet(pet: Pet) {
    const current = this.getPets();
    this.savePets([pet, ...current]);
  },
  getOwners(): Owner[] {
    const raw = localStorage.getItem('vetify_owners');
    return raw ? JSON.parse(raw) : INITIAL_OWNERS;
  },
  saveOwners(owners: Owner[]) {
    localStorage.setItem('vetify_owners', JSON.stringify(owners));
  },
  addOwner(owner: Owner) {
    const current = this.getOwners();
    this.saveOwners([owner, ...current]);
  },
  getVaccines(): VaccineRecord[] {
    const raw = localStorage.getItem('vetify_vaccines');
    return raw ? JSON.parse(raw) : INITIAL_VACCINES;
  },
  getVaccinesByPet(petId: string): VaccineRecord[] {
    return this.getVaccines().filter((v: VaccineRecord) => v.petId === petId);
  },
  saveVaccines(vax: VaccineRecord[]) {
    localStorage.setItem('vetify_vaccines', JSON.stringify(vax));
  },
  getDewormings(): DewormingRecord[] {
    const raw = localStorage.getItem('vetify_dewormings');
    return raw ? JSON.parse(raw) : INITIAL_DEWORMINGS;
  },
  getDewormingByPet(petId: string): DewormingRecord[] {
    return this.getDewormings().filter((d: DewormingRecord) => d.petId === petId);
  },
  saveDewormings(dew: DewormingRecord[]) {
    localStorage.setItem('vetify_dewormings', JSON.stringify(dew));
  },
  getConsultations(): ConsultationRecord[] {
    const raw = localStorage.getItem('vetify_consultations');
    return raw ? JSON.parse(raw) : INITIAL_CONSULTATIONS;
  },
  getConsultationsByPet(petId: string): ConsultationRecord[] {
    return this.getConsultations().filter((c: ConsultationRecord) => c.petId === petId);
  },
  saveConsultations(cons: ConsultationRecord[]) {
    localStorage.setItem('vetify_consultations', JSON.stringify(cons));
  },
  addConsultation(cons: ConsultationRecord) {
    const current = this.getConsultations();
    this.saveConsultations([cons, ...current]);
  },
  getAppointments(): Appointment[] {
    const raw = localStorage.getItem('vetify_appointments');
    return raw ? JSON.parse(raw) : INITIAL_APPOINTMENTS;
  },
  saveAppointments(apts: Appointment[]) {
    localStorage.setItem('vetify_appointments', JSON.stringify(apts));
  },
  addAppointment(apt: Appointment) {
    const current = this.getAppointments();
    this.saveAppointments([apt, ...current]);
  },
  updateAppointmentStatus(id: string, status: Appointment['status']) {
    const current = this.getAppointments();
    const updated = current.map((a: Appointment) => a.id === id ? { ...a, status } : a);
    this.saveAppointments(updated);
  },
  getProducts(): Product[] {
    const raw = localStorage.getItem('vetify_products');
    if (!raw) return INITIAL_PRODUCTS;
    try {
      const parsed: Product[] = JSON.parse(raw);
      return parsed.map((p: Product) => {
        const initial = INITIAL_PRODUCTS.find((ip: Product) => ip.id === p.id);
        return initial ? { ...initial, ...p, imageUrl: initial.imageUrl } : p;
      });
    } catch {
      return INITIAL_PRODUCTS;
    }
  },
  saveProducts(prods: Product[]) {
    localStorage.setItem('vetify_products', JSON.stringify(prods));
  },
  getCart(): CartItem[] {
    const raw = localStorage.getItem('vetify_cart');
    if (!raw) return [];
    try {
      const parsed: CartItem[] = JSON.parse(raw);
      return parsed.map((item: CartItem) => {
        const fullProd = INITIAL_PRODUCTS.find((p: Product) => p.id === item.product.id);
        return fullProd ? { ...item, product: { ...item.product, imageUrl: fullProd.imageUrl } } : item;
      });
    } catch {
      return [];
    }
  },
  saveCart(cart: CartItem[]) {
    localStorage.setItem('vetify_cart', JSON.stringify(cart));
  },
  getOrders(): Order[] {
    const raw = localStorage.getItem('vetify_orders');
    return raw ? JSON.parse(raw) : [];
  },
  saveOrders(orders: Order[]) {
    localStorage.setItem('vetify_orders', JSON.stringify(orders));
  },
  addOrder(order: Order) {
    const current = this.getOrders();
    this.saveOrders([order, ...current]);
  },
  resetToDefaults() {
    localStorage.removeItem('vetify_pets');
    localStorage.removeItem('vetify_owners');
    localStorage.removeItem('vetify_vaccines');
    localStorage.removeItem('vetify_dewormings');
    localStorage.removeItem('vetify_consultations');
    localStorage.removeItem('vetify_appointments');
    localStorage.removeItem('vetify_products');
    localStorage.removeItem('vetify_cart');
    localStorage.removeItem('vetify_orders');
  }
};

