import React from 'react';
import { 
  X, 
  Printer, 
  CalendarBlank 
} from '@phosphor-icons/react';
import type { ConsultationRecord, Pet } from '../../types';


interface MedicalHistoryModalProps {
  consultation: ConsultationRecord | null;
  pet: Pet | null;
  onClose: () => void;
}

export const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({
  consultation,
  pet,
  onClose
}) => {
  if (!consultation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-md bg-forest/10 text-forest">
                Acto Médico Certificado
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {consultation.id}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {consultation.reason}
            </h2>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CalendarBlank size={14} className="text-forest" weight="bold" />
                {consultation.date}
              </span>
              <span>•</span>
              <span>{consultation.veterinarianName}</span>
              {pet && (
                <>
                  <span>•</span>
                  <span className="font-medium text-slate-800">
                    Paciente: {pet.name} ({pet.breed})
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-800 transition-colors"
            title="Cerrar"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-800 text-sm">
          {/* Vital signs */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Constantes Fisiológicas & Triaje
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[11px] text-slate-500 block">Temperatura</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block font-mono">
                  {consultation.vitalSigns.tempCelsius} °C
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Normal</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[11px] text-slate-500 block">Frecuencia Cardíaca</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block font-mono">
                  {consultation.vitalSigns.heartRateBpm} <span className="text-xs font-normal">ppm</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Rítmico</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[11px] text-slate-500 block">Peso</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block font-mono">
                  {consultation.vitalSigns.weightKg} <span className="text-xs font-normal">kg</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Báscula digital</span>
              </div>
            </div>
          </div>

          {/* Anamnesis and Diagnosis */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Anamnesis y Hallazgos Clínicos
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {consultation.anamnesis}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                Diagnóstico Conclusivo
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {consultation.diagnosis}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Tratamiento y Recomendaciones
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {consultation.treatment}
              </p>
            </div>
          </div>

          {/* Prescriptions */}
          {consultation.prescriptions && consultation.prescriptions.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Prescripción Farmacológica
              </span>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                {consultation.prescriptions.map((rx, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-3 bg-white text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 block text-sm">
                        {rx.medication}
                      </span>
                      <span className="text-slate-500">
                        {rx.dosage} • {rx.frequency}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 font-mono text-slate-700">
                      {rx.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Firma digital homologada por <strong>Vetify Clinical OS</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
            >
              <Printer size={15} weight="bold" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
