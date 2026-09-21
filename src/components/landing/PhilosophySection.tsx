import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Clock, 
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react';

export const PhilosophySection: React.FC = () => {
  const principles = [
    {
      title: 'Consultas de 45 minutos sin prisas',
      desc: 'El animal necesita explorar y aclimatarse antes de cualquier manipulación clínica.',
      icon: Clock,
    },
    {
      title: 'Manejo no invasivo por refuerzo',
      desc: 'Sujeción amable, toallas aromatizadas con feromonas y cero inmovilizaciones violentas.',
      icon: Heart,
    },
    {
      title: 'Aislamiento sensorial por especie',
      desc: 'Separación acústica y olfativa absoluta entre pacientes caninos y felinos.',
      icon: ShieldCheck,
    },
    {
      title: 'Trazabilidad digital sin papeles',
      desc: 'Historias clínicas, lotes de vacunas y recetas verificadas en tu móvil al instante.',
      icon: CheckCircle,
    },
  ];

  return (
    <section id="filosofia" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest block">
            Metodología Clínica
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Protocolo Fear-Free: Bienestar sin miedo ni coerción.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Eliminamos el trauma habitual de las visitas veterinarias mediante arquitectura fonoabsorbente y tiempos médicos reales.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                  <Icon size={22} weight="bold" />
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Comparison Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Compromiso Certificado
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Diseñado para cambiar la experiencia de tu mascota para siempre.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No medimos el éxito en cantidad de consultas atendidas por hora, sino en la calma con la que un perro o gato ingresa a nuestro hospital.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                <WarningCircle size={14} weight="bold" /> En clínicas habituales
              </span>
              <p className="text-xs text-slate-300">
                10-15 min por turno, mesas frías y ruidos que elevan el cortisol.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-forest/80 border border-forest-light space-y-1">
              <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                <CheckCircle size={14} weight="bold" /> En Vetify
              </span>
              <p className="text-xs text-slate-200">
                45 min dedicados, toallas tibias, silencio y registro digitalizado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
