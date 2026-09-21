import React, { useState } from 'react';
import { 
  CheckCircle, 
  X,
  Dog,
  Cat
} from '@phosphor-icons/react';
import { VetOSStorage } from '../../domain/store';
import type { HospitalizationEpisode, ClinicalTask } from '../../domain/types';

export const InpatientWhiteboard: React.FC = () => {
  const [episodes, setEpisodes] = useState<HospitalizationEpisode[]>(() => VetOSStorage.getHospitalization());
  const [activeTaskModal, setActiveTaskModal] = useState<{ episodeId: string; task: ClinicalTask } | null>(null);
  const [taskNotes, setTaskNotes] = useState('');

  const handleExecuteTask = (status: 'DONE' | 'SKIPPED' | 'DELAYED') => {
    if (!activeTaskModal) return;
    VetOSStorage.updateTaskStatus(activeTaskModal.episodeId, activeTaskModal.task.id, status, taskNotes);
    setEpisodes(VetOSStorage.getHospitalization());
    setActiveTaskModal(null);
    setTaskNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest">
              Internación & Terapia Intensiva
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Pizarra Activa de Boxes & Tareas de Enfermería
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
            {episodes.length} Camas Ocupadas
          </span>
        </div>
      </div>

      {/* Ward Beds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {episodes.map((ep) => {
          const isCritical = ep.clinicalStatus === 'CRITICAL';
          const isObservation = ep.clinicalStatus === 'OBSERVATION';

          return (
            <div
              key={ep.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Bed & Patient Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold text-sm">
                    {ep.species === 'FELINE' ? <Cat size={22} weight="bold" /> : <Dog size={22} weight="bold" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                        {ep.bedCode}
                      </span>
                      <h3 className="font-bold text-base text-slate-900">
                        {ep.patientName}
                      </h3>
                      <span className="text-xs text-slate-500">
                        ({ep.breed})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Médico a cargo: <strong>{ep.attendingVetName}</strong>
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border ${
                  isCritical 
                    ? 'bg-rose-100 text-rose-800 border-rose-200' 
                    : isObservation 
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {ep.clinicalStatus}
                </span>
              </div>

              {/* Diagnosis & Diet */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="text-slate-800">
                  <strong className="text-slate-900">Diagnóstico de Ingreso:</strong> {ep.admissionReason}
                </div>
                <div className="text-slate-600">
                  <strong>Indicaciones Nutricionales:</strong> {ep.feedingInstructions}
                </div>
              </div>

              {/* Scheduled Clinical Tasks (Nursing Rounds) */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 block">
                  Ronda de Tareas Clínicas & Medicación:
                </span>

                <div className="space-y-2">
                  {ep.tasks.map((task) => {
                    const isDone = task.status === 'DONE';
                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 transition-colors ${
                          isDone 
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-700' 
                            : 'bg-white border-slate-200 hover:border-forest/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-forest bg-forest/5 px-2 py-0.5 rounded text-[11px]">
                            {task.scheduledTime}
                          </span>
                          <div>
                            <span className={`font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {task.title}
                            </span>
                            {task.notes && (
                              <p className="text-[11px] text-slate-500 italic mt-0.5">
                                "{task.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Task Execution Action */}
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] shrink-0">
                            <CheckCircle size={14} weight="fill" />
                            <span>Realizado</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setActiveTaskModal({ episodeId: ep.id, task })}
                            className="px-2.5 py-1 rounded-lg bg-forest text-white font-semibold text-[11px] hover:bg-forest-light transition-all shrink-0 cursor-pointer shadow-xs"
                          >
                            Registrar
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Execution Modal */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono uppercase text-forest font-bold">
                Ronda de Enfermería · Box Inpatient
              </span>
              <button
                onClick={() => setActiveTaskModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <span className="text-[11px] font-mono text-forest font-bold">
                Horario: {activeTaskModal.task.scheduledTime}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {activeTaskModal.task.title}
              </h3>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Observaciones Clínicas / Signos Vitales
              </label>
              <textarea
                value={taskNotes}
                onChange={e => setTaskNotes(e.target.value)}
                placeholder="Ej. Temp: 38.6°C, administración por vía periférica sin incidentes..."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleExecuteTask('DONE')}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs cursor-pointer text-center"
              >
                Administrado (DONE)
              </button>
              <button
                onClick={() => handleExecuteTask('DELAYED')}
                className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs cursor-pointer text-center"
              >
                Pospuesto
              </button>
              <button
                onClick={() => handleExecuteTask('SKIPPED')}
                className="py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer text-center"
              >
                Omitido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
