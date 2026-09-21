import React, { useState } from 'react';
import { 
  MagnifyingGlass, 
  Plus, 
  Eye, 
  CaretRight 
} from '@phosphor-icons/react';
import { StorageService } from '../../data/seedData';
import { PetProfileCard } from '../clinical/PetProfileCard';
import { VaccinationCard } from '../clinical/VaccinationCard';
import { MedicalHistoryModal } from '../clinical/MedicalHistoryModal';
import { LongitudinalTimeline } from '../clinical/LongitudinalTimeline';
import { VetOSStorage } from '../../domain/store';
import type { Pet, ConsultationRecord, Appointment } from '../../types';
import type { TimelineEvent } from '../../domain/types';

export const AdminDashboard: React.FC = () => {
  const [pets] = useState<Pet[]>(StorageService.getPets());
  const [appointments] = useState<Appointment[]>(StorageService.getAppointments());
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);
  const [activeClinicalTab, setActiveClinicalTab] = useState<'timeline' | 'consultations' | 'vaccines'>('timeline');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() => {
    return selectedPet ? VetOSStorage.getTimelineEvents(selectedPet.id) : [];
  });

  // Modals
  const [viewingConsultation, setViewingConsultation] = useState<ConsultationRecord | null>(null);
  const [isAddingConsultation, setIsAddingConsultation] = useState(false);

  // Form State
  const [newReason, setNewReason] = useState('');
  const [newAnamnesis, setNewAnamnesis] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  const [newTemp, setNewTemp] = useState('38.5');
  const [newBpm, setNewBpm] = useState('110');
  const [newWeight, setNewWeight] = useState(selectedPet?.weightKg.toString() || '15');
  const [rxMedication, setRxMedication] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxFrequency, setRxFrequency] = useState('');
  const [rxDuration, setRxDuration] = useState('');

  // Filtered Pets
  const filteredPets = pets.filter((pet) => {
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.microchipNumber.includes(searchQuery);
    const matchesSpecies = speciesFilter === 'all' || pet.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const petVaccines = selectedPet ? StorageService.getVaccinesByPet(selectedPet.id) : [];
  const petConsultations = selectedPet ? StorageService.getConsultationsByPet(selectedPet.id) : [];

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    const newRecord: ConsultationRecord = {
      id: `cons-${Date.now().toString().slice(-4)}`,
      petId: selectedPet.id,
      date: '2026-09-22',
      reason: newReason,
      anamnesis: newAnamnesis,
      diagnosis: newDiagnosis,
      treatment: newTreatment,
      vitalSigns: {
        tempCelsius: parseFloat(newTemp) || 38.5,
        heartRateBpm: parseInt(newBpm) || 110,
        weightKg: parseFloat(newWeight) || selectedPet.weightKg,
      },
      prescriptions: rxMedication ? [{
        medication: rxMedication,
        dosage: rxDosage || '1 comprimido',
        frequency: rxFrequency || 'Cada 12 horas',
        duration: rxDuration || '7 días'
      }] : [],
      veterinarianName: 'Dra. Valentina Rossi (M.P. 4482)'
    };

    StorageService.addConsultation(newRecord);

    // Auto-append event to VetOS Longitudinal Timeline
    const newTimelineEvent: TimelineEvent = {
      id: `tle-${Date.now()}`,
      organizationId: 'org-vetify-hospital',
      patientId: selectedPet.id,
      eventType: 'CONSULTATION',
      eventId: newRecord.id,
      eventDate: new Date().toISOString(),
      title: `Consulta: ${newRecord.reason}`,
      summary: `Diagnóstico: ${newRecord.diagnosis}. Conducta: ${newRecord.treatment}`,
      createdById: 'user-admin',
      createdByName: 'Dra. Valentina Rossi (MP 4821)',
      isOwnerVisible: true,
      metadata: {
        temp: `${newRecord.vitalSigns.tempCelsius} °C`,
        heartRate: `${newRecord.vitalSigns.heartRateBpm} bpm`,
        weight: `${newRecord.vitalSigns.weightKg} kg`
      }
    };
    VetOSStorage.addTimelineEvent(newTimelineEvent);
    setTimelineEvents(VetOSStorage.getTimelineEvents(selectedPet.id));

    setIsAddingConsultation(false);
    setNewReason('');
    setNewAnamnesis('');
    setNewDiagnosis('');
    setNewTreatment('');
    setRxMedication('');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-forest block">
            Dirección Médica & Auditoría
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Padrón de Pacientes e Historias Clínicas
          </h1>
        </div>

        <button
          onClick={() => setIsAddingConsultation(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover transition-colors shadow-xs active:scale-[0.98]"
        >
          <Plus size={15} weight="bold" />
          <span>Nueva Evolución Médica</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total Pacientes</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block font-mono">{pets.length}</span>
          <span className="text-[11px] text-emerald-700">Trazabilidad Microchip</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Agenda de Hoy</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block font-mono">
            {appointments.filter(a => a.date === '2026-09-22').length || 4}
          </span>
          <span className="text-[11px] text-slate-500">Turnos programados</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">En Sala de Espera</span>
          <span className="text-2xl font-bold text-amber-700 mt-1 block font-mono">
            {appointments.filter(a => a.status === 'En espera').length}
          </span>
          <span className="text-[11px] text-amber-700">Triaje Activo</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Vacunación Vigente</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block font-mono">94.8%</span>
          <span className="text-[11px] text-slate-500">Protección inmunitaria</span>
        </div>
      </div>

      {/* Main Grid: Directory Left (5 cols), Patient Chart Right (7 cols) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Directory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Directorio</h3>
              <span className="text-xs text-slate-400">{filteredPets.length} registros</span>
            </div>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlass size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, chip, tutor o raza..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 outline-none focus:border-forest"
              />
            </div>

            {/* Species Filter */}
            <div className="flex items-center gap-1.5">
              {['all', 'Canino', 'Felino'].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpeciesFilter(sp)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    speciesFilter === sp
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sp === 'all' ? 'Todos' : sp}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredPets.map((pet) => {
                const isSelected = selectedPet?.id === pet.id;
                return (
                  <div
                    key={pet.id}
                    onClick={() => {
                      setSelectedPet(pet);
                      setTimelineEvents(VetOSStorage.getTimelineEvents(pet.id));
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-forest bg-forest/5 shadow-xs'
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pet.photoUrl}
                        alt={pet.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{pet.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {pet.species}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block">
                          {pet.breed} • Tutor: {pet.ownerName}
                        </span>
                      </div>
                    </div>
                    <CaretRight size={14} className={isSelected ? 'text-forest' : 'text-slate-300'} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Medical Chart */}
        <div className="lg:col-span-7 space-y-6">
          {selectedPet ? (
            <>
              <PetProfileCard pet={selectedPet} />

              {/* Clinical Workspace Tabs */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveClinicalTab('timeline')}
                      className={`pb-2 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                        activeClinicalTab === 'timeline'
                          ? 'text-forest border-forest'
                          : 'text-slate-400 border-transparent hover:text-slate-700'
                      }`}
                    >
                      Timeline Longitudinal
                    </button>
                    <button
                      onClick={() => setActiveClinicalTab('consultations')}
                      className={`pb-2 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                        activeClinicalTab === 'consultations'
                          ? 'text-forest border-forest'
                          : 'text-slate-400 border-transparent hover:text-slate-700'
                      }`}
                    >
                      Consultas ({petConsultations.length})
                    </button>
                    <button
                      onClick={() => setActiveClinicalTab('vaccines')}
                      className={`pb-2 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                        activeClinicalTab === 'vaccines'
                          ? 'text-forest border-forest'
                          : 'text-slate-400 border-transparent hover:text-slate-700'
                      }`}
                    >
                      Vacunaciones ({petVaccines.length})
                    </button>
                  </div>

                  <button
                    onClick={() => setIsAddingConsultation(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-all shadow-xs cursor-pointer"
                  >
                    <Plus size={13} weight="bold" />
                    <span>Nueva Consulta</span>
                  </button>
                </div>

                {/* Tab Content 1: Longitudinal Timeline */}
                {activeClinicalTab === 'timeline' && (
                  <div className="animate-fadeIn pt-2">
                    <LongitudinalTimeline
                      patientId={selectedPet.id}
                      patientName={selectedPet.name}
                      events={timelineEvents}
                      canAddNote={true}
                      onAddNote={(note) => {
                        const newEvt: TimelineEvent = {
                          id: `tle-${Date.now()}`,
                          organizationId: 'org-vetify-hospital',
                          patientId: selectedPet.id,
                          eventType: 'NOTE',
                          eventId: `note-${Date.now()}`,
                          eventDate: new Date().toISOString(),
                          title: 'Nota de Evolución Clínica',
                          summary: note,
                          createdById: 'user-admin',
                          createdByName: 'Dra. Valentina Rossi (Dirección Médica)',
                          isOwnerVisible: true
                        };
                        VetOSStorage.addTimelineEvent(newEvt);
                        setTimelineEvents(VetOSStorage.getTimelineEvents(selectedPet.id));
                      }}
                    />
                  </div>
                )}

                {/* Tab Content 2: Consultations */}
                {activeClinicalTab === 'consultations' && (
                  <div className="space-y-3 animate-fadeIn">
                  {petConsultations.length > 0 ? (
                    petConsultations.map((c: ConsultationRecord) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-colors space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[11px] font-mono font-semibold text-forest block">
                              {c.date} • {c.veterinarianName}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                              {c.reason}
                            </h4>
                          </div>
                          <button
                            onClick={() => setViewingConsultation(c)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-800 text-xs font-medium text-slate-700 transition-colors"
                          >
                            <Eye size={13} weight="bold" />
                            <span>Ver Receta</span>
                          </button>
                        </div>

                        <div className="text-xs text-slate-600 space-y-0.5">
                          <p><strong>Diagnóstico:</strong> {c.diagnosis}</p>
                          <p><strong>Conducta:</strong> {c.treatment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      Sin consultas previas registradas.
                    </p>
                  )}
                  </div>
                )}

                {/* Tab Content 3: Digital Vaccines */}
                {activeClinicalTab === 'vaccines' && (
                  <div className="pt-2 animate-fadeIn">
                    <VaccinationCard vaccines={petVaccines} petName={selectedPet.name} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-400">
              Selecciona un paciente del padrón.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Consultation Entry */}
      {isAddingConsultation && selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-forest block">
                  Acto Médico Digital
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Nueva Consulta para {selectedPet.name}
                </h3>
              </div>
              <button
                onClick={() => setIsAddingConsultation(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConsultation} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motivo Principal *</label>
                <input
                  type="text"
                  required
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Ej. Chequeo preventivo semestral"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-forest text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTemp}
                    onChange={(e) => setNewTemp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frecuencia (ppm)</label>
                  <input
                    type="number"
                    value={newBpm}
                    onChange={(e) => setNewBpm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Anamnesis *</label>
                <textarea
                  rows={2}
                  required
                  value={newAnamnesis}
                  onChange={(e) => setNewAnamnesis(e.target.value)}
                  placeholder="Auscultación, hidratación, palpación..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-forest text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Diagnóstico *</label>
                <input
                  type="text"
                  required
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  placeholder="Ej. Sin hallazgos patológicos relevantes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-forest text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tratamiento *</label>
                <textarea
                  rows={2}
                  required
                  value={newTreatment}
                  onChange={(e) => setNewTreatment(e.target.value)}
                  placeholder="Indicaciones y posología..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-forest text-xs"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Receta Digital (Opcional)
                </span>
                <div className="grid sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={rxMedication}
                    onChange={(e) => setRxMedication(e.target.value)}
                    placeholder="Medicamento (ej. Apoquel 5.4mg)"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={rxDosage}
                    onChange={(e) => setRxDosage(e.target.value)}
                    placeholder="Dosis (ej. 1 comp cada 12h)"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={rxFrequency}
                    onChange={(e) => setRxFrequency(e.target.value)}
                    placeholder="Frecuencia (ej. Cada 12 horas)"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={rxDuration}
                    onChange={(e) => setRxDuration(e.target.value)}
                    placeholder="Duración (ej. 7 días)"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingConsultation(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover shadow-xs"
                >
                  Firmar en Historia Clínica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MedicalHistoryModal
        consultation={viewingConsultation}
        pet={selectedPet}
        onClose={() => setViewingConsultation(null)}
      />
    </div>
  );
};
