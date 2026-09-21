import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  WarningCircle, 
  Certificate,
  Syringe
} from '@phosphor-icons/react';
import type { VaccineRecord } from '../../types';

interface VaccinationCardProps {
  vaccines: VaccineRecord[];
  petName?: string;
  onAddVaccine?: () => void;
  canEdit?: boolean;
}

export const VaccinationCard: React.FC<VaccinationCardProps> = ({
  vaccines,
  petName,
  onAddVaccine,
  canEdit = false
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest/5 text-forest flex items-center justify-center">
            <ShieldCheck size={24} weight="duotone" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Cartilla Sanitaria de Inmunización
            </h3>
            <p className="text-xs text-slate-500">
              Certificación oficial con trazabilidad de lote y firma profesional de {petName || 'Paciente'}
            </p>
          </div>
        </div>

        {canEdit && onAddVaccine && (
          <button
            onClick={onAddVaccine}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover transition-colors active:scale-[0.98]"
          >
            <Syringe size={15} weight="bold" />
            <span>Aplicar Vacuna</span>
          </button>
        )}
      </div>

      {/* Vaccines Grid */}
      {vaccines.length === 0 ? (
        <div className="py-10 text-center text-xs text-slate-400">
          No hay registros de inmunización para este paciente.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vaccines.map((vax) => {
            const isValid = vax.status === 'Vigente';
            const isExpiring = vax.status === 'Próxima a vencer';
            const isExpired = vax.status === 'Vencida';

            return (
              <div
                key={vax.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  isExpired
                    ? 'border-rose-200 bg-rose-50/40'
                    : isExpiring
                    ? 'border-amber-200 bg-amber-50/40'
                    : 'border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                      {vax.type}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isValid
                          ? 'bg-emerald-100 text-emerald-800'
                          : isExpiring
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isValid && <CheckCircle size={12} weight="fill" />}
                      {isExpiring && <Clock size={12} weight="bold" />}
                      {isExpired && <WarningCircle size={12} weight="fill" />}
                      <span>{vax.status}</span>
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-900 text-sm leading-snug">
                    {vax.vaccineName}
                  </h4>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Aplicación:</span>
                    <span className="font-mono font-medium text-slate-900">{vax.dateAdministered}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Próximo Refuerzo:</span>
                    <span className={`font-mono font-bold ${
                      isExpired ? 'text-rose-600' : isExpiring ? 'text-amber-700' : 'text-slate-900'
                    }`}>
                      {vax.nextDueDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Certificate size={12} weight="bold" />
                      Lote: {vax.batchNumber}
                    </span>
                    <span>{vax.licenseNumber}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
