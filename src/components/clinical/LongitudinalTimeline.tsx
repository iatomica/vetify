import React, { useState } from 'react';
import { 
  Heartbeat, 
  FirstAid, 
  ShieldCheck, 
  FileText, 
  Clock, 
  User, 
  ArrowRight,
  Plus,
  Funnel,
  CheckCircle
} from '@phosphor-icons/react';
import type { TimelineEvent, TimelineEventType } from '../../domain/types';

interface LongitudinalTimelineProps {
  patientId: string;
  patientName: string;
  events: TimelineEvent[];
  onAddNote?: (note: string) => void;
  canAddNote?: boolean;
}

export const LongitudinalTimeline: React.FC<LongitudinalTimelineProps> = ({
  patientName,
  events,
  onAddNote,
  canAddNote = false
}) => {
  const [selectedFilter, setSelectedFilter] = useState<TimelineEventType | 'ALL'>('ALL');
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeEventModal, setActiveEventModal] = useState<TimelineEvent | null>(null);

  const filteredEvents = events.filter(e => {
    if (selectedFilter === 'ALL') return true;
    return e.eventType === selectedFilter;
  });

  const getEventBadge = (type: TimelineEventType) => {
    switch (type) {
      case 'CONSULTATION':
        return { label: 'Consulta Médica', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Heartbeat };
      case 'PRESCRIPTION':
        return { label: 'Receta Firmada', color: 'bg-teal-100 text-teal-800 border-teal-200', icon: FirstAid };
      case 'VACCINATION':
        return { label: 'Inmunización', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: ShieldCheck };
      case 'LAB_RESULT':
        return { label: 'Laboratorio', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: FileText };
      case 'HOSPITALIZATION':
        return { label: 'Internación', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock };
      default:
        return { label: 'Evolución', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: FileText };
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !onAddNote) return;
    onAddNote(newNoteText.trim());
    setNewNoteText('');
    setIsAddingNote(false);
  };

  return (
    <div className="space-y-6">
      {/* Timeline Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-forest font-bold">
              Historial Longitudinal Unificado
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            Línea de Tiempo Clínica · {patientName}
          </h3>
        </div>

        {/* Action Button for Notes */}
        {canAddNote && (
          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus size={14} weight="bold" />
            <span>Añadir Nota Clínica</span>
          </button>
        )}
      </div>

      {/* Note Creation Form */}
      {isAddingNote && (
        <form onSubmit={handleSaveNote} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
          <label className="text-xs font-semibold text-slate-800 block">
            Evolución o Nota Rápida del Profesional
          </label>
          <textarea
            value={newNoteText}
            onChange={e => setNewNoteText(e.target.value)}
            rows={3}
            required
            placeholder="Escriba la evolución clínica, observación telefónica o reporte de guardia..."
            className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-forest"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-all shadow-xs"
            >
              Guardar en Timeline
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1 mr-1">
          <Funnel size={13} />
          Filtrar:
        </span>
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedFilter === 'ALL' ? 'bg-forest text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Todos ({events.length})
        </button>
        <button
          onClick={() => setSelectedFilter('CONSULTATION')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedFilter === 'CONSULTATION' ? 'bg-forest text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Consultas
        </button>
        <button
          onClick={() => setSelectedFilter('PRESCRIPTION')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedFilter === 'PRESCRIPTION' ? 'bg-forest text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Recetas
        </button>
        <button
          onClick={() => setSelectedFilter('VACCINATION')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedFilter === 'VACCINATION' ? 'bg-forest text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Vacunaciones
        </button>
        <button
          onClick={() => setSelectedFilter('LAB_RESULT')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedFilter === 'LAB_RESULT' ? 'bg-forest text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Laboratorios
        </button>
      </div>

      {/* Events Stream */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6">
        {filteredEvents.map((event) => {
          const badge = getEventBadge(event.eventType);
          const Icon = badge.icon;
          return (
            <div key={event.id} className="relative group">
              {/* Event Marker Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-forest flex items-center justify-center text-forest group-hover:scale-110 group-hover:bg-forest group-hover:text-white transition-all shadow-xs">
                <Icon size={12} weight="bold" />
              </div>

              {/* Event Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all shadow-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {event.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(event.eventDate).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.summary}
                </p>

                {/* Metadata badges if present */}
                {event.metadata && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <span key={key} className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 text-[10px] font-mono border border-slate-100">
                        <strong>{key}:</strong> {String(value)}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {event.createdByName}
                  </span>
                  <button
                    onClick={() => setActiveEventModal(event)}
                    className="text-forest hover:text-forest-dark font-medium inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Ver detalle</span>
                    <ArrowRight size={11} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            No hay eventos registrados bajo el filtro seleccionado.
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {activeEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono uppercase text-forest font-bold">
                Registro Clínico · {activeEventModal.eventType}
              </span>
              <button
                onClick={() => setActiveEventModal(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{activeEventModal.title}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Fecha: {new Date(activeEventModal.eventDate).toLocaleString('es-AR')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {activeEventModal.summary}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Firmado por: {activeEventModal.createdByName}</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle size={14} weight="fill" />
                Validado
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
