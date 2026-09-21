import React from 'react';
import { 
  Heartbeat, 
  FirstAid, 
  Cat, 
  Pulse, 
  ArrowRight,
  ShieldCheck,
  Tooth
} from '@phosphor-icons/react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section id="especialidades" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest block">
            Especialidades Médicas
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Departamentos de alta complejidad diagnóstica y quirúrgica.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Equipamiento hospitalario de última generación orientado al confort biológico de cada especie.
          </p>
        </div>

        {/* Asymmetric Bento Grid with Real Photographic Anchors */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Bento Cell 1: Large Featured Cat-Friendly Clinic (2 cols span) */}
          <div className="md:col-span-2 relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white flex flex-col justify-between group min-h-[340px]">
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/cat-care.webp"
                alt="Medicina Felina Cat-Friendly"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
            </div>

            <div className="relative z-10 p-6 flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-semibold flex items-center gap-1.5">
                <Cat size={16} weight="bold" className="text-forest" />
                Cat-Friendly Clinic Gold
              </span>
            </div>

            <div className="relative z-10 p-6 text-white space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">
                Medicina y Comportamiento Felino
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-md leading-relaxed">
                Sala de espera y consultorio sin olores caninos, difusores de feromonas faciales y tiempos pausados para minimizar el estrés.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onSelectService('Medicina y Comportamiento Felino')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white transition-colors"
                >
                  <span>Agendar Consulta Felina</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            </div>
          </div>

          {/* Bento Cell 2: Cirugía de Flujo Laminar (Dark Forest Accent Tile) */}
          <div className="rounded-2xl p-6 bg-forest text-white border border-forest-light flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-emerald-300">
                <FirstAid size={22} weight="bold" />
              </div>
              <span className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider block mb-1">
                Quirófano Central
              </span>
              <h3 className="text-lg font-bold tracking-tight mb-2">
                Cirugía de Tejidos Blandos y Traumatología
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Anestesia inhalatoria monitoreada multiparamétricamente y analgesia multimodal preventiva.
              </p>
            </div>

            <button
              onClick={() => onSelectService('Cirugía y Traumatología')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white transition-colors pt-4"
            >
              <span>Consultar Procedimientos</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>

          {/* Bento Cell 3: Diagnóstico por Imágenes */}
          <div className="rounded-2xl p-6 bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-slate-800">
                <Pulse size={22} weight="bold" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Diagnóstico 4K
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                Ecografía Doppler & Radiografía Digital
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Informes digitales inmediatos sincronizados automáticamente en la cartilla sanitaria del paciente.
              </p>
            </div>

            <button
              onClick={() => onSelectService('Diagnóstico por Imágenes')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-hover transition-colors pt-4"
            >
              <span>Solicitar Estudio</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>

          {/* Bento Cell 4: Cardiología */}
          <div className="rounded-2xl p-6 bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-slate-800">
                <Heartbeat size={22} weight="bold" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Medicina Interna
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                Cardiología Clínica y Monitoreo Holter
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluación cardiovascular geriátrica, screening prequirúrgico y ecocardiograma color.
              </p>
            </div>

            <button
              onClick={() => onSelectService('Cardiología')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-hover transition-colors pt-4"
            >
              <span>Ver Disponibilidad</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>

          {/* Bento Cell 5: Featured Doctor Exam (2 cols span) */}
          <div className="md:col-span-2 relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white flex flex-col justify-between group min-h-[300px]">
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/doctor-exam.webp"
                alt="Exploración compasiva"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
            </div>

            <div className="relative z-10 p-6 flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck size={16} weight="bold" className="text-forest" />
                Consulta Integral
              </span>
            </div>

            <div className="relative z-10 p-6 text-white space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">
                Medicina Preventiva y Planes de Salud
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-md leading-relaxed">
                Exámenes clínicos exhaustivos de 45 minutos con registro digital de vacunas, peso y recetas en Vetify OS.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onSelectService('Consulta General')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white transition-colors"
                >
                  <span>Agendar Examen Preventivo</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            </div>
          </div>

          {/* Bento Cell 6: Odontología */}
          <div className="rounded-2xl p-6 bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-slate-800">
                <Tooth size={22} weight="bold" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Profilaxis
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                Odontología y Limpieza Ultrasónica
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tratamiento periodontal no doloroso y pulido piezoeléctrico para prevenir cardiopatías secundarias.
              </p>
            </div>

            <button
              onClick={() => onSelectService('Odontología')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-hover transition-colors pt-4"
            >
              <span>Consultar Turno</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
