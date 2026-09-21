import React from 'react';
import { 
  PhoneCall, 
  SignIn, 
  CalendarBlank, 
  Sparkle,
  ShoppingBag
} from '@phosphor-icons/react';

import type { User } from '../../types';

interface NavbarProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onOpenBooking: () => void;
  onGoToDashboard: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onOpenBooking,
  onGoToDashboard,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-base shadow-xs">
            V
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 block leading-none">
              Vetify
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              Hospital Clínico
            </span>
          </div>
        </div>

        {/* Nav Links (Single line, strictly under 80px) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
          <a href="#especialidades" className="hover:text-forest transition-colors">
            Especialidades
          </a>
          <a href="#tienda" className="hover:text-forest transition-colors font-semibold text-slate-800">
            Tienda & Farmacia
          </a>
          <a href="#filosofia" className="hover:text-forest transition-colors">
            Protocolo Fear-Free
          </a>
          <a href="#sistema" className="hover:text-forest transition-colors">
            Vetify OS
          </a>
          <a href="#contacto" className="hover:text-forest transition-colors">
            Guardia 24h
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          {/* Emergency 24h Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <PhoneCall size={13} weight="bold" />
            <span>0800-888-VET</span>
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir carrito"
            className="relative p-2 rounded-xl border border-slate-200 hover:border-slate-800 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ShoppingBag size={18} weight="bold" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-all active:scale-[0.98] shadow-xs cursor-pointer"
          >
            <CalendarBlank size={15} weight="bold" />
            <span className="hidden sm:inline">Reservar Cita</span>
            <span className="sm:hidden">Cita</span>
          </button>

          {currentUser ? (
            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkle size={14} weight="fill" className="text-forest" />
              <span className="hidden sm:inline">Portal ({currentUser.role === 'admin' ? 'Médico' : currentUser.role === 'reception' ? 'Recepción' : 'Mi Mascota'})</span>
              <span className="sm:hidden">Portal</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:border-slate-800 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer"
            >
              <SignIn size={15} weight="bold" />
              <span>Acceso</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
