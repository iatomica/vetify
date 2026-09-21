import { useState } from 'react';
import { 
  Sparkle, 
  SignOut, 
  ArrowLeft, 
  QrCode, 
  CheckCircle,
  ShieldCheck,
  User,
  Heart,
  Globe,
  Bed
} from '@phosphor-icons/react';
import { seedUsers, StorageService } from './data/seedData';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { ServicesSection } from './components/landing/ServicesSection';
import { PhilosophySection } from './components/landing/PhilosophySection';
import { Footer } from './components/landing/Footer';
import { BookingModal } from './components/landing/BookingModal';
import { LoginModal } from './components/auth/LoginModal';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ReceptionDashboard } from './components/dashboard/ReceptionDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { VaccinationCard } from './components/clinical/VaccinationCard';
import { StoreSection } from './components/store/StoreSection';
import { CartDrawer } from './components/store/CartDrawer';
import { InpatientWhiteboard } from './components/inpatient/InpatientWhiteboard';
import type { User as UserType, Product, CartItem } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [currentUser, setCurrentUser] = useState<UserType | null>(seedUsers[0]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => StorageService.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const previewPet = StorageService.getPets()[0]; // Milo
  const previewVaccines = StorageService.getVaccinesByPet(previewPet.id);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      let updated: CartItem[];
      if (existingIndex >= 0) {
        updated = prev.map((item, idx) => 
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, { product, quantity: 1 }];
      }
      StorageService.saveCart(updated);
      return updated;
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      const updated = prev
        .map(item => item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0);
      StorageService.saveCart(updated);
      return updated;
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.product.id !== productId);
      StorageService.saveCart(updated);
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    StorageService.saveCart([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleSelectService = (serviceName: string) => {
    setBookingService(serviceName);
    setIsBookingOpen(true);
  };

  const handleSwitchRole = (role: 'admin' | 'reception' | 'client' | 'hospitalization') => {
    const matched = seedUsers.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink font-sans flex flex-col selection:bg-forest selection:text-white">
      {/* Top Demo Bar for Testing */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-400">
              Vetify OS · Vista Interactiva:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                currentView === 'landing'
                  ? 'bg-white text-slate-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Globe size={13} weight="bold" />
              <span>Landing Web</span>
            </button>

            <span className="text-slate-600 hidden sm:inline">|</span>

            <button
              onClick={() => handleSwitchRole('admin')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                currentView === 'dashboard' && currentUser?.role === 'admin'
                  ? 'bg-forest text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck size={13} weight="bold" />
              <span>Admin / Dra. Rossi</span>
            </button>

            <button
              onClick={() => handleSwitchRole('reception')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                currentView === 'dashboard' && currentUser?.role === 'reception'
                  ? 'bg-forest text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <User size={13} weight="bold" />
              <span>Recepción Central</span>
            </button>

            <button
              onClick={() => handleSwitchRole('client')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                currentView === 'dashboard' && currentUser?.role === 'client'
                  ? 'bg-forest text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Heart size={13} weight="bold" />
              <span>Tutor / Camila</span>
            </button>

            <button
              onClick={() => handleSwitchRole('hospitalization')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                currentView === 'dashboard' && currentUser?.role === 'hospitalization'
                  ? 'bg-forest text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Bed size={13} weight="bold" />
              <span>Internación / Boxes</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: LANDING PAGE */}
      {currentView === 'landing' ? (
        <>
          <Navbar
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenBooking={() => {
              setBookingService('');
              setIsBookingOpen(true);
            }}
            onGoToDashboard={() => setCurrentView('dashboard')}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
          />

          <main className="flex-grow">
            <HeroSection
              onOpenBooking={() => {
                setBookingService('');
                setIsBookingOpen(true);
              }}
              onOpenLogin={() => setIsLoginOpen(true)}
            />

            <ServicesSection onSelectService={handleSelectService} />

            <StoreSection
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={totalCartCount}
            />

            <PhilosophySection />

            {/* Live Interactive Medical Passport Preview */}
            <section id="sistema" className="py-20 bg-slate-50 border-b border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-forest block">
                      Gestión Sanitaria Digital
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                      La cartilla clínica oficial de tu mascota en tiempo real.
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Olvídate de libretas de papel extraviadas. Vetify OS unifica inmunizaciones con trazabilidad de lote, microchip ISO y recetas médicas electrónicas homologadas.
                    </p>

                    <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle size={18} weight="fill" className="text-forest shrink-0 mt-0.5" />
                        <span><strong>Validación Profesional:</strong> Firma y matrícula médica digital verificada.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle size={18} weight="fill" className="text-forest shrink-0 mt-0.5" />
                        <span><strong>QR de Emergencia:</strong> Lectura instantánea de alergias y antecedentes críticos.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle size={18} weight="fill" className="text-forest shrink-0 mt-0.5" />
                        <span><strong>Alertas de Refuerzo:</strong> Notificaciones 30 días antes del vencimiento sanitario.</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleSwitchRole('client')}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-forest text-white text-xs sm:text-sm font-semibold hover:bg-forest-hover transition-colors shadow-xs active:scale-[0.98]"
                      >
                        <Sparkle size={16} weight="fill" />
                        <span>Explorar Cartilla Digital en Vivo</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Card Preview */}
                  <div className="lg:col-span-7">
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-lg space-y-5">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={previewPet.photoUrl}
                            alt={previewPet.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <h3 className="font-bold text-base text-slate-900">
                              {previewPet.name}
                            </h3>
                            <span className="text-xs text-slate-500">
                              {previewPet.breed} · Microchip: {previewPet.microchipNumber}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono">
                          <QrCode size={16} weight="bold" />
                          <span>QR Activo</span>
                        </div>
                      </div>

                      <VaccinationCard vaccines={previewVaccines} petName={previewPet.name} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenBooking={() => {
              setBookingService('');
              setIsBookingOpen(true);
            }}
          />
        </>
      ) : (
        /* VIEW 2: VETIFY OS DASHBOARD */
        <div className="flex-grow flex flex-col">
          {/* Dashboard Header */}
          <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('landing')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft size={14} weight="bold" />
                  <span>Volver a la Web</span>
                </button>

                <div className="h-4 w-px bg-slate-200" />

                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-slate-900">
                    Vetify OS
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                    currentUser?.role === 'admin'
                      ? 'bg-forest/10 text-forest'
                      : currentUser?.role === 'reception'
                      ? 'bg-blue-100 text-blue-800'
                      : currentUser?.role === 'hospitalization'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {currentUser?.role === 'admin' 
                      ? 'Dirección Médica' 
                      : currentUser?.role === 'reception' 
                      ? 'Recepción & Triaje' 
                      : currentUser?.role === 'hospitalization'
                      ? 'Internación & Enfermería'
                      : 'Portal Propietario'}
                  </span>
                </div>
              </div>

              {/* User info & Logout */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {currentUser?.name}
                  </span>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    {currentUser?.email}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser?.name.charAt(0)}
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors ml-1"
                  title="Cerrar Sesión"
                >
                  <SignOut size={16} weight="bold" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Dashboard Workspace */}
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentUser?.role === 'admin' && <AdminDashboard />}
            {currentUser?.role === 'reception' && <ReceptionDashboard />}
            {currentUser?.role === 'hospitalization' && <InpatientWhiteboard />}
            {currentUser?.role === 'client' && (
              <ClientDashboard
                onOpenBooking={() => {
                  setBookingService('');
                  setIsBookingOpen(true);
                }}
                onAddToCart={handleAddToCart}
                onGoToStore={() => {
                  setCurrentView('landing');
                  setTimeout(() => {
                    document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                }}
              />
            )}
          </main>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={bookingService}
        onAppointmentCreated={(_newApt) => {}}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLogin}
      />
    </div>
  );
}

export default App;
