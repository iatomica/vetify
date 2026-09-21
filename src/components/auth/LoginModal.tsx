import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Heart, 
  SignIn, 
  ArrowRight 
} from '@phosphor-icons/react';
import { seedUsers } from '../../data/seedData';
import type { User } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [selectedRole] = useState<'admin' | 'reception' | 'client'>('admin');

  const [email, setEmail] = useState('valentina.rossi@vetify.com');
  const [password, setPassword] = useState('••••••••');

  if (!isOpen) return null;

  const handleQuickLogin = (role: 'admin' | 'reception' | 'client') => {
    const matchedUser = seedUsers.find((u) => u.role === role);
    if (matchedUser) {
      onLoginSuccess(matchedUser);
      onClose();
    }
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = seedUsers.find((u) => u.role === selectedRole);
    if (matchedUser) {
      onLoginSuccess(matchedUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-forest/10 text-forest block w-fit mb-1">
              Vetify OS Auth
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Acceso a la Plataforma
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Quick Demo Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              1-Click Demo Profiles
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-forest/60 bg-white hover:bg-slate-50/60 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-forest/10 text-forest flex items-center justify-center">
                    <ShieldCheck size={18} weight="bold" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Dra. Valentina Rossi · Admin
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Dirección médica, padrón y evoluciones
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-forest transition-colors" weight="bold" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('reception')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-forest/60 bg-white hover:bg-slate-50/60 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <UserCheck size={18} weight="bold" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Tomás Morales · Recepción
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Flujo de espera, check-in e ingreso rápido
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-forest transition-colors" weight="bold" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('client')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-forest/60 bg-white hover:bg-slate-50/60 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                    <Heart size={18} weight="bold" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Camila Benítez · Tutora
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Cartilla digital de Milo (Canino) y Luna (Felina)
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-forest transition-colors" weight="bold" />
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              o credenciales
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleStandardSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <SignIn size={15} weight="bold" />
              <span>Iniciar Sesión</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
