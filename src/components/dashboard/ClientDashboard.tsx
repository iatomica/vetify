import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  DownloadSimple, 
  Eye, 
  Bug, 
  Plus, 
  WarningCircle,
  ShoppingBag,
  Heartbeat,
  ArrowRight,
  CheckCircle
} from '@phosphor-icons/react';

import { StorageService } from '../../data/seedData';
import { VetOSStorage } from '../../domain/store';
import { PetProfileCard } from '../clinical/PetProfileCard';
import { VaccinationCard } from '../clinical/VaccinationCard';
import { MedicalHistoryModal } from '../clinical/MedicalHistoryModal';
import { LongitudinalTimeline } from '../clinical/LongitudinalTimeline';
import type { Pet, ConsultationRecord, VaccineRecord, DewormingRecord, Product } from '../../types';

interface ClientDashboardProps {
  onOpenBooking: () => void;
  onAddToCart?: (product: Product) => void;
  onGoToStore?: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ 
  onOpenBooking,
  onAddToCart,
  onGoToStore
}) => {
  const [pets] = useState<Pet[]>(() => {
    const ownerPets = StorageService.getPets().filter((p: Pet) => p.ownerId === 'owner-camila');
    return ownerPets.length > 0 ? ownerPets : StorageService.getPets().slice(0, 2);
  });
  const [selectedPet, setSelectedPet] = useState<Pet>(pets[0] || StorageService.getPets()[0]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'vaccines' | 'consultations' | 'deworming' | 'pharmacy'>('timeline');
  const [viewingConsultation, setViewingConsultation] = useState<ConsultationRecord | null>(null);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const vaccines = StorageService.getVaccinesByPet(selectedPet.id);
  const consultations = StorageService.getConsultationsByPet(selectedPet.id);
  const dewormings = StorageService.getDewormingByPet(selectedPet.id);

  const expiredVaccines = vaccines.filter((v: VaccineRecord) => v.status === 'Vencida').length;
  const dueSoonVaccines = vaccines.filter((v: VaccineRecord) => v.status === 'Próxima a vencer').length;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-forest block">
            Portal del Propietario · Mis Mascotas
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Cartilla Sanitaria y Registro Médico
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <DownloadSimple size={15} weight="bold" />
            <span>Descargar PDF</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover transition-colors shadow-xs active:scale-[0.98]"
          >
            <Plus size={15} weight="bold" />
            <span>Solicitar Turno</span>
          </button>
        </div>
      </div>

      {/* Pet Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
        {pets.map((pet) => {
          const isSelected = selectedPet.id === pet.id;
          return (
            <button
              key={pet.id}
              onClick={() => setSelectedPet(pet)}
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
              <span>{pet.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                pet.species === 'Felino' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
              }`}>
                {pet.species}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vaccine Expiration Alert if any */}
      {(dueSoonVaccines > 0 || expiredVaccines > 0) && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <WarningCircle size={20} weight="fill" className="text-amber-600 shrink-0" />
            <span>
              {selectedPet.name} tiene{' '}
              {dueSoonVaccines > 0 && `${dueSoonVaccines} vacuna(s) próxima(s) a vencer`}
              {expiredVaccines > 0 && ` y ${expiredVaccines} pendiente(s) de revacunación`}.
            </span>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-3 py-1.5 rounded-lg bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors shrink-0"
          >
            Agendar Refuerzo
          </button>
        </div>
      )}

      {/* Pet Profile Details */}
      <PetProfileCard pet={selectedPet} />

      {/* Tabs */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 flex items-center gap-6 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'text-forest border-forest'
                : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            <Heartbeat size={16} weight="bold" />
            <span>Línea de Vida Clínica</span>
          </button>

          <button
            onClick={() => setActiveTab('vaccines')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'vaccines'
                ? 'text-forest border-forest'
                : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            <ShieldCheck size={16} weight="bold" />
            <span>Vacunas ({vaccines.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('consultations')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'consultations'
                ? 'text-forest border-forest'
                : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            <FileText size={16} weight="bold" />
            <span>Consultas y Recetas ({consultations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deworming')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'deworming'
                ? 'text-forest border-forest'
                : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            <Bug size={16} weight="bold" />
            <span>Desparasitaciones ({dewormings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'pharmacy'
                ? 'text-forest border-forest'
                : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            <ShoppingBag size={16} weight="bold" />
            <span>Farmacia & Nutrición</span>
          </button>
        </div>

        {/* Tab 0: Longitudinal Timeline */}
        {activeTab === 'timeline' && (
          <div className="animate-fadeIn">
            <LongitudinalTimeline
              patientId={selectedPet.id}
              patientName={selectedPet.name}
              events={VetOSStorage.getTimelineEvents(selectedPet.id).filter(e => e.isOwnerVisible)}
              canAddNote={false}
            />
          </div>
        )}

        {/* Tab 1: Vaccines */}
        {activeTab === 'vaccines' && (
          <div className="animate-fadeIn">
            <VaccinationCard vaccines={vaccines} petName={selectedPet.name} />
          </div>
        )}

        {/* Tab 2: Consultations */}
        {activeTab === 'consultations' && (
          <div className="space-y-3 animate-fadeIn">
            {consultations.map((c: ConsultationRecord) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-forest font-semibold block">
                      {c.date} • {c.veterinarianName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">
                      {c.reason}
                    </h3>
                  </div>
                  <button
                    onClick={() => setViewingConsultation(c)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors self-start sm:self-auto"
                  >
                    <Eye size={14} weight="bold" />
                    <span>Ver Ficha & Receta</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">
                      Diagnóstico
                    </span>
                    <p className="font-semibold text-slate-900">
                      {c.diagnosis}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">
                      Tratamiento
                    </span>
                    <p className="text-slate-600">
                      {c.treatment}
                    </p>
                  </div>
                </div>

                {c.prescriptions && c.prescriptions.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-xs flex items-center justify-between">
                    <span className="text-slate-900">
                      💊 Receta Activa: <strong className="text-emerald-900">{c.prescriptions[0].medication}</strong> ({c.prescriptions[0].dosage})
                    </span>
                    <span className="font-mono text-slate-500">
                      {c.prescriptions[0].duration}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Deworming */}
        {activeTab === 'deworming' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid sm:grid-cols-2 gap-4">
              {dewormings.map((dw: DewormingRecord) => (
                <div
                  key={dw.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        {dw.type}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1">
                        {dw.product}
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {dw.dateAdministered}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 pt-1">
                    <span>Peso: {dw.weightAtAdminKg} kg · Profesional: {dw.veterinarianName}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Próximo refuerzo sugerido:</span>
                    <span className="font-bold text-forest font-mono">{dw.nextDueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Pharmacy & Clinical Food tailored for this pet */}
        {activeTab === 'pharmacy' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-forest/5 border border-forest/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center shrink-0">
                  <ShoppingBag size={20} weight="bold" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Insumos & Nutrición para {selectedPet.name} ({selectedPet.breed})
                  </h4>
                  <p className="text-xs text-slate-600">
                    Basado en su especie ({selectedPet.species}), peso ({selectedPet.weightKg} kg) y antecedentes médicos.
                  </p>
                </div>
              </div>

              {onGoToStore && (
                <button
                  onClick={onGoToStore}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Ver Tienda Completa</span>
                  <ArrowRight size={13} weight="bold" />
                </button>
              )}
            </div>

            {/* Tailored Product Recommendations */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {StorageService.getProducts()
                .filter(p => p.suitableFor === selectedPet.species || p.suitableFor === 'Ambos')
                .map((product) => {
                  const isAdded = addedItemNotice === product.id;
                  return (
                    <div 
                      key={product.id}
                      className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        {product.imageUrl && (
                          <div className="relative aspect-video w-full rounded-lg bg-slate-50 border border-slate-100 overflow-hidden mb-3 flex items-center justify-center">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {product.badge && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-forest text-[9px] font-bold shadow-xs">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                            {product.brand}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5 mb-2">
                          {product.unit}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-bold font-mono text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => {
                            if (onAddToCart) {
                              onAddToCart(product);
                              setAddedItemNotice(product.id);
                              setTimeout(() => setAddedItemNotice(null), 1200);
                            }
                          }}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-forest text-white hover:bg-forest-light'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle size={13} weight="bold" />
                              <span>Agregado</span>
                            </>
                          ) : (
                            <>
                              <Plus size={13} weight="bold" />
                              <span>Repedir</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <MedicalHistoryModal
        consultation={viewingConsultation}
        pet={selectedPet}
        onClose={() => setViewingConsultation(null)}
      />
    </div>
  );
};
