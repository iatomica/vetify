import React from 'react';
import { 
  PhoneCall, 
  MapPin, 
  Clock, 
  EnvelopeSimple 
} from '@phosphor-icons/react';


interface FooterProps {
  onOpenLogin: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLogin, onOpenBooking }) => {
  return (
    <footer id="contacto" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-base">
                V
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Vetify
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Centro hospitalario veterinario de alta complejidad y medicina preventiva. Protocolos compasivos y trazabilidad digital con Vetify OS.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200 block">
              Guardia y Emergencias 24/7
            </span>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <PhoneCall size={16} className="text-emerald-400 shrink-0 mt-0.5" weight="bold" />
              <div>
                <strong className="text-white block font-mono">0800-888-VETIFY</strong>
                <span>Atención médica continuada los 365 días del año</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-1">
              <Clock size={16} className="text-emerald-400 shrink-0 mt-0.5" weight="bold" />
              <span>Consultas programadas: Lun a Sáb 8:00 a 20:00</span>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200 block">
              Sede Central
            </span>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin size={16} className="text-emerald-400 shrink-0 mt-0.5" weight="bold" />
              <div>
                <span className="text-white block font-medium">Av. del Libertador 4200</span>
                <span>Palermo Chico, CABA</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-1">
              <EnvelopeSimple size={16} className="text-emerald-400 shrink-0 mt-0.5" weight="bold" />
              <span>contacto@vetify.com</span>
            </div>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200 block">
              Acceso Rápido
            </span>
            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-forest hover:bg-forest-hover text-white font-semibold transition-colors text-center block"
              >
                Reservar Cita Online
              </button>
              <button
                onClick={onOpenLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold transition-colors text-center block"
              >
                Acceso Vetify OS (Demo)
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Vetify Clinical Systems. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Fear-Free Certified</span>
            <span>•</span>
            <span>Cat-Friendly Clinic Gold</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
