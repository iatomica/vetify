import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  WarningCircle, 
  Plus,
  Dog,
  Cat
} from '@phosphor-icons/react';
import { VetOSStorage } from '../../domain/store';
import type { LiveQueueEntry, QueueState, UrgencyLevel } from '../../domain/types';

interface LiveQueueBoardProps {
  onCallPatient?: (queueEntry: LiveQueueEntry) => void;
}

export const LiveQueueBoard: React.FC<LiveQueueBoardProps> = ({ onCallPatient }) => {
  const [queue, setQueue] = useState<LiveQueueEntry[]>(() => VetOSStorage.getQueue());
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newTutorName, setNewTutorName] = useState('');
  const [newTutorPhone, setNewTutorPhone] = useState('');
  const [newUrgency, setNewUrgency] = useState<UrgencyLevel>('ROUTINE');
  const [newNotes, setNewNotes] = useState('');

  const handleUpdateStatus = (id: string, nextState: QueueState) => {
    VetOSStorage.updateQueueState(id, nextState);
    setQueue(VetOSStorage.getQueue());
  };

  const handleCreateIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newTutorName.trim()) return;

    const newEntry: LiveQueueEntry = {
      id: `q-${Date.now()}`,
      organizationId: 'org-vetify-hospital',
      branchId: 'branch-headquarters',
      patientId: `pet-quick-${Date.now()}`,
      patientName: newPatientName.trim(),
      species: 'CANINE',
      breed: 'Mestizo / En evaluación',
      tutorName: newTutorName.trim(),
      tutorPhone: newTutorPhone.trim() || '+54 11 0000-0000',
      checkInTime: new Date().toISOString(),
      queueState: 'WAITING',
      triageNotes: newNotes.trim() || 'Ingreso espontáneo por recepción',
      urgencyLevel: newUrgency
    };

    const updated = [newEntry, ...queue];
    VetOSStorage.saveQueue(updated);
    setQueue(updated);

    // Reset form
    setNewPatientName('');
    setNewTutorName('');
    setNewTutorPhone('');
    setNewNotes('');
    setIsAddingPatient(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest">
              Mesa de Entrada & Triaje Activo
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Pizarra de Espera en Tiempo Real
          </h2>
        </div>

        <button
          onClick={() => setIsAddingPatient(!isAddingPatient)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} weight="bold" />
          <span>Ingreso Rápido de Paciente</span>
        </button>
      </div>

      {/* Quick Intake Form */}
      {isAddingPatient && (
        <form onSubmit={handleCreateIntake} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-sm text-slate-900">Admisión de Paciente en Espera</h4>
            <span className="text-[11px] text-slate-400 font-mono">Check-In Express</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nombre Paciente</label>
              <input
                type="text"
                required
                value={newPatientName}
                onChange={e => setNewPatientName(e.target.value)}
                placeholder="Ej. Toby / Oliver"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Tutor Responsable</label>
              <input
                type="text"
                required
                value={newTutorName}
                onChange={e => setNewTutorName(e.target.value)}
                placeholder="Nombre y Apellido"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Teléfono Contacto</label>
              <input
                type="tel"
                value={newTutorPhone}
                onChange={e => setNewTutorPhone(e.target.value)}
                placeholder="+54 9 11 ..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nivel de Triaje (Confirmado por Personal)</label>
              <select
                value={newUrgency}
                onChange={e => setNewUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              >
                <option value="ROUTINE">Rutina / Control Programado</option>
                <option value="PRIORITY">Prioritario (Dolor agudo / Vómitos repetidos)</option>
                <option value="EMERGENCY">Urgencia Crítica (Dificultad respiratoria / Shock)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Motivo de Consulta / Observaciones</label>
              <input
                type="text"
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                placeholder="Síntomas iniciales observados en mesa de entrada"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddingPatient(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-forest text-white text-xs font-semibold hover:bg-forest-light shadow-xs cursor-pointer"
            >
              Confirmar Check-In
            </button>
          </div>
        </form>
      )}

      {/* Queue Columns / Stream */}
      <div className="space-y-3">
        {queue.map((entry) => {
          const isUrgent = entry.urgencyLevel === 'EMERGENCY';
          const isPriority = entry.urgencyLevel === 'PRIORITY';

          return (
            <div
              key={entry.id}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isUrgent 
                  ? 'border-rose-300 bg-rose-50/40' 
                  : isPriority
                  ? 'border-amber-300 bg-amber-50/30'
                  : 'border-slate-200/90'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  entry.species === 'FELINE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {entry.species === 'FELINE' ? <Cat size={20} weight="bold" /> : <Dog size={20} weight="bold" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-slate-900">
                      {entry.patientName}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      ({entry.breed})
                    </span>

                    {/* Urgency Badge */}
                    {isUrgent && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px] tracking-wider uppercase border border-rose-200 flex items-center gap-1">
                        <WarningCircle size={12} weight="fill" />
                        Emergencia
                      </span>
                    )}
                    {isPriority && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] tracking-wider uppercase border border-amber-200">
                        Prioritario
                      </span>
                    )}

                    {/* State Badge */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                      entry.queueState === 'WAITING'
                        ? 'bg-slate-100 text-slate-700'
                        : entry.queueState === 'IN_CONSULTATION'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {entry.queueState === 'WAITING' && 'En Espera'}
                      {entry.queueState === 'IN_CONSULTATION' && 'En Box Médico'}
                      {entry.queueState === 'LAB_IMAGING' && 'En Laboratorio / Rayos'}
                      {entry.queueState === 'PHARMACY' && 'En Farmacia'}
                      {entry.queueState === 'FINISHED' && 'Completado'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">
                    Tutor: <strong>{entry.tutorName}</strong> · Tel: {entry.tutorPhone}
                  </p>

                  {entry.triageNotes && (
                    <p className="text-xs text-slate-500 italic mt-0.5">
                      "{entry.triageNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                {entry.queueState === 'WAITING' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(entry.id, 'IN_CONSULTATION');
                      if (onCallPatient) onCallPatient(entry);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-all shadow-xs cursor-pointer"
                  >
                    <span>Llamar a Box</span>
                    <ArrowRight size={13} weight="bold" />
                  </button>
                )}

                {entry.queueState === 'IN_CONSULTATION' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(entry.id, 'PHARMACY')}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
                    >
                      Pase a Farmacia
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(entry.id, 'FINISHED')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer shadow-xs"
                    >
                      <CheckCircle size={13} weight="bold" />
                      <span>Finalizar</span>
                    </button>
                  </>
                )}

                {entry.queueState === 'PHARMACY' && (
                  <button
                    onClick={() => handleUpdateStatus(entry.id, 'FINISHED')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer shadow-xs"
                  >
                    <CheckCircle size={13} weight="bold" />
                    <span>Entregado</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {queue.length === 0 && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-500">
            No hay pacientes en sala de espera en este momento.
          </div>
        )}
      </div>
    </div>
  );
};
