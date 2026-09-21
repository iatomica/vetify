import React from 'react';
import { 
  Barcode, 
  Check, 
  WarningCircle 
} from '@phosphor-icons/react';
import type { Pet } from '../../types';

interface PetProfileCardProps {
  pet: Pet;
}

export const PetProfileCard: React.FC<PetProfileCardProps> = ({ pet }) => {

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      {/* Header Profile Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {pet.name}
              </h2>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                pet.species === 'Felino'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-emerald-100 text-emerald-900'
              }`}>
                {pet.species}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {pet.breed}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tutor Registrado: <strong className="text-slate-800 font-medium">{pet.ownerName}</strong>
            </p>
          </div>
        </div>

        {/* Microchip Badge */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 self-start sm:self-auto">
          <Barcode size={22} className="text-slate-700" weight="regular" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider font-semibold">
              Microchip ISO 11784
            </span>
            <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
              {pet.microchipNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Vital Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-slate-50/60 border border-slate-100">
          <span className="text-[11px] text-slate-500 block mb-0.5">Edad Cronológica</span>
          <span className="text-sm font-semibold text-slate-900">{pet.ageYears} años</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/60 border border-slate-100">
          <span className="text-[11px] text-slate-500 block mb-0.5">Peso Actual</span>
          <span className="text-sm font-semibold text-slate-900">{pet.weightKg} kg</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/60 border border-slate-100">
          <span className="text-[11px] text-slate-500 block mb-0.5">Sexo & Reproducción</span>
          <span className="text-sm font-semibold text-slate-900">
            {pet.gender} {pet.isNeutered ? '· Castrado/a' : '· Entero/a'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/60 border border-slate-100">
          <span className="text-[11px] text-slate-500 block mb-0.5">Estado Clínico</span>
          <span className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
            <Check size={14} weight="bold" /> Activo & Al día
          </span>
        </div>
      </div>

      {/* Allergies and Special Care Alerts if any */}
      {pet.allergies && pet.allergies.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
          <WarningCircle size={18} className="text-amber-700 shrink-0 mt-0.5" weight="bold" />
          <div>

            <span className="text-xs font-bold text-amber-900 block">
              Advertencia Clínica / Alergias Declaradas:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {pet.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-[11px] text-amber-900 font-medium"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
