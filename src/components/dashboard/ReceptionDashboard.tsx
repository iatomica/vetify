import React, { useState } from 'react';
import { 
  Clock, 
  UserPlus, 
  MagnifyingGlass, 
  Phone, 
  ArrowRight, 
  WarningCircle,
  Users,
  CalendarCheck,
  CheckCircle
} from '@phosphor-icons/react';

import { StorageService } from '../../data/seedData';
import { LiveQueueBoard } from '../queue/LiveQueueBoard';
import type { Appointment, AppointmentStatus, Pet, Owner } from '../../types';

export const ReceptionDashboard: React.FC = () => {
  const [receptionView, setReceptionView] = useState<'queue' | 'appointments'>('queue');
  const [appointments, setAppointments] = useState<Appointment[]>(StorageService.getAppointments());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Intake Modal
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<'Canino' | 'Felino' | 'Exótico'>('Canino');
  const [petBreed, setPetBreed] = useState('');
  const [petWeight, setPetWeight] = useState('12');
  const [microchip, setMicrochip] = useState('');
  const [allergies, setAllergies] = useState('');

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    StorageService.updateAppointmentStatus(appointmentId, newStatus);
    setAppointments(StorageService.getAppointments());
  };

  const handleRegisterIntake = (e: React.FormEvent) => {
    e.preventDefault();

    const newOwnerId = `own-${Date.now().toString().slice(-4)}`;
    const newPetId = `pet-${Date.now().toString().slice(-4)}`;

    const newOwner: Owner = {
      id: newOwnerId,
      fullName: ownerName,
      email: `${ownerName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: ownerPhone,
      address: 'Buenos Aires, CABA',
      emergencyContact: ownerPhone,
      petIds: [newPetId],
    };

    const newPet: Pet = {
      id: newPetId,
      name: petName,
      species: petSpecies,
      breed: petBreed || 'Mestizo',
      gender: 'Macho',
      birthDate: '2023-01-01',
      ageYears: 2,
      weightKg: parseFloat(petWeight) || 10,
      microchipNumber: microchip || `981098${Date.now().toString().slice(-9)}`,
      photoUrl: petSpecies === 'Felino'
        ? '/assets/cat-care.webp'
        : '/assets/doctor-exam.webp',
      ownerId: newOwnerId,
      ownerName: ownerName,
      allergies: allergies ? [allergies] : [],
      chronicConditions: [],
      isNeutered: true,
    };

    StorageService.addOwner(newOwner);
    StorageService.addPet(newPet);

    const immediateAppt: Appointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      petId: newPetId,
      petName: newPet.name,
      species: newPet.species,
      ownerId: newOwnerId,
      ownerName: newOwner.fullName,
      ownerPhone: newOwner.phone,
      date: '2026-09-22',
      time: '11:45',
      reason: 'Ingreso Nuevo Paciente - Triaje',
      veterinarianName: newPet.species === 'Felino' ? 'Dra. Valentina Rossi' : 'Dr. Tomás Morales',
      status: 'En espera',
      urgencyLevel: 'Normal',
    };

    StorageService.addAppointment(immediateAppt);
    setAppointments(StorageService.getAppointments());

    setOwnerName('');
    setOwnerPhone('');
    setPetName('');
    setPetBreed('');
    setMicrochip('');
    setAllergies('');
    setIsIntakeModalOpen(false);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = 
      apt.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'En espera':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'En consulta':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Completado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Confirmado':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-forest block">
            Mesa de Entrada & Admisión
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Flujo de Espera y Triaje Diario
          </h1>
        </div>

        <button
          onClick={() => setIsIntakeModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover transition-colors shadow-xs active:scale-[0.98]"
        >
          <UserPlus size={15} weight="bold" />
          <span>Ingreso Rápido de Paciente</span>
        </button>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
        <button
          onClick={() => setReceptionView('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            receptionView === 'queue'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users size={15} weight="bold" />
          <span>Cola en Vivo & Triaje (LiveQueue)</span>
        </button>

        <button
          onClick={() => setReceptionView('appointments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            receptionView === 'appointments'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CalendarCheck size={15} weight="bold" />
          <span>Agenda de Turnos Programados ({appointments.length})</span>
        </button>
      </div>

      {/* VIEW A: LIVE QUEUE */}
      {receptionView === 'queue' && (
        <div className="animate-fadeIn">
          <LiveQueueBoard />
        </div>
      )}

      {/* VIEW B: APPOINTMENTS SCHEDULE */}
      {receptionView === 'appointments' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <MagnifyingGlass size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por paciente, tutor o motivo..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 outline-none focus:border-forest"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['all', 'Confirmado', 'En espera', 'En consulta', 'Completado'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'Todos los Turnos' : st}
                </button>
              ))}
            </div>
          </div>

      {/* List */}
      <div className="space-y-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex flex-col items-center justify-center shrink-0">
                  <Clock size={16} weight="bold" className="text-forest" />
                  <span className="font-mono font-bold text-xs mt-0.5">{apt.time}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-slate-900">
                      {apt.petName}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      apt.species === 'Felino' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {apt.species}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(apt.status)}`}>
                      {apt.status}
                    </span>
                    {apt.urgencyLevel === 'Urgencia' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <WarningCircle size={12} weight="bold" /> Urgencia
                      </span>
                    )}

                  </div>

                  <p className="text-xs text-slate-600">
                    Motivo: <strong className="text-slate-800">{apt.reason}</strong> · Profesional: {apt.veterinarianName}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Tutor: <strong className="text-slate-700">{apt.ownerName}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone size={12} weight="bold" />
                      {apt.ownerPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {apt.status === 'Confirmado' && (
                  <button
                    onClick={() => handleStatusChange(apt.id, 'En espera')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Hacer Check-In</span>
                    <ArrowRight size={13} weight="bold" />
                  </button>
                )}

                {apt.status === 'En espera' && (
                  <button
                    onClick={() => handleStatusChange(apt.id, 'En consulta')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Llamar a Box</span>
                    <ArrowRight size={13} weight="bold" />
                  </button>
                )}

                {apt.status === 'En consulta' && (
                  <button
                    onClick={() => handleStatusChange(apt.id, 'Completado')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} weight="fill" />
                    <span>Concluir</span>
                  </button>
                )}

                {apt.status === 'Completado' && (
                  <span className="text-xs text-emerald-800 font-medium px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200">
                    ✓ Finalizado
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs">
            No se encontraron turnos.
          </div>
        )}
      </div>
    </div>
  )}

      {/* Quick Intake Modal */}
      {isIntakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-lg font-bold text-slate-900">
                Ingreso Rápido de Paciente
              </h3>
              <button
                onClick={() => setIsIntakeModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterIntake} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre del Tutor *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ej. Martín Ruiz"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-forest text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+54 11 4444-5555"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-forest text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre Mascota *</label>
                  <input
                    type="text"
                    required
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Ej. Simón"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-forest text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Especie *</label>
                  <select
                    value={petSpecies}
                    onChange={(e) => setPetSpecies(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-forest text-xs"
                  >
                    <option value="Canino">Canino</option>
                    <option value="Felino">Felino</option>
                    <option value="Exótico">Exótico</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Raza</label>
                  <input
                    type="text"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    placeholder="Ej. Mestizo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={petWeight}
                    onChange={(e) => setPetWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Microchip</label>
                  <input
                    type="text"
                    value={microchip}
                    onChange={(e) => setMicrochip(e.target.value)}
                    placeholder="Opcional"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alergias</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="Opcional"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIntakeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover shadow-xs"
                >
                  Registrar e Ingresar a Espera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
