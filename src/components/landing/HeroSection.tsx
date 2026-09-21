import React from 'react';
import { 
  ArrowUpRight, 
  Sparkle 
} from '@phosphor-icons/react';


interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onOpenLogin,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 md:pt-16 pb-16 min-h-[calc(100dvh-4rem)] flex items-center bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: 4-Item Stack (Eyebrow, Headline, Subtext, CTAs) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 text-forest text-xs font-semibold">
              <Sparkle size={13} weight="fill" />
              <span>Hospital Clínico de Alta Complejidad</span>
            </div>

            {/* 2. Headline (Max 2 lines) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.08]">
              Medicina veterinaria de vanguardia y cuidado compasivo.
            </h1>

            {/* 3. Subtext (Max 20 words) */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Atención clínica especializada bajo protocolos Fear-Free y seguimiento en tiempo real mediante el sistema digital Vetify OS.
            </p>

            {/* 4. CTAs (1 primary + 1 secondary, no wrapping) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest-hover shadow-sm transition-all active:scale-[0.98]"
              >
                <span>Reservar Consulta Médica</span>
                <ArrowUpRight size={16} weight="bold" />
              </button>

              <button
                onClick={onOpenLogin}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:border-slate-800 hover:text-slate-900 bg-white transition-all active:scale-[0.98]"
              >
                <span>Ingresar al Sistema (Demo)</span>
              </button>
            </div>

            {/* Trust Metrics Directly Below Hero Copy */}
            <div className="pt-8 border-t border-slate-100 grid grid-cols-3 gap-6">
              <div>
                <span className="block text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
                  12.4k+
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Pacientes digitalizados
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
                  24/7
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Guardia médica activa
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
                  100%
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Fear-Free Certified
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Photographic Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] lg:aspect-[4/5] bg-slate-100 group">
              <img
                src="/assets/hero-clinic.webp"
                alt="Instalaciones de Vetify Hospital Veterinario"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

              {/* Inside Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/50 text-slate-900">
                <span className="text-[10px] uppercase font-mono font-bold text-forest tracking-wider block">
                  Instalaciones Silenciosas
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
                  Salas con climatización y circuitos canino y felino independientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
