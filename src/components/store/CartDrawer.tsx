import React, { useState } from 'react';
import { 
  X, 
  Trash, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle, 
  FileText, 
  MapPin, 
  Clock, 
  ShieldCheck,
  WhatsappLogo
} from '@phosphor-icons/react';
import { StorageService } from '../../data/seedData';
import type { CartItem, Order } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [shippingMethod, setShippingMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [recipientName, setRecipientName] = useState('Camila Benítez');
  const [recipientPhone, setRecipientPhone] = useState('+54 9 11 5489-3210');
  const [address, setAddress] = useState('Av. Libertador 2450, 4to B');
  const [petName, setPetName] = useState('Milo (Golden Retriever)');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = shippingMethod === 'delivery' ? 3.50 : 0;
  const total = subtotal + shippingFee;
  const hasPrescriptionItem = cartItems.some(i => i.product.requiresPrescription);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const newOrder: Order = {
      id: `VTF-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      items: [...cartItems],
      total,
      shippingMethod,
      recipientName,
      recipientPhone,
      address: shippingMethod === 'delivery' ? address : 'Retiro en Farmacia Vetify (Av. Libertador 1850)',
      petName,
      prescriptionVerified: false
    };

    StorageService.addOrder(newOrder);
    setCompletedOrder(newOrder);
    onClearCart();
  };

  const handleCloseAll = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={handleCloseAll}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest/10 text-forest flex items-center justify-center">
                <ShoppingBag size={18} weight="bold" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Mi Pedido Farmacéutico
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {cartItems.reduce((sum, i) => sum + i.quantity, 0)} insumos seleccionados
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseAll}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {completedOrder ? (
              /* Order Completed State */
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} weight="fill" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-forest font-semibold block">
                    {completedOrder.id}
                  </span>
                  <h4 className="text-lg font-semibold text-slate-900 mt-1">
                    ¡Pedido Registrado con Éxito!
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Hemos enviado la confirmación a farmacia clínica para alistar los productos de {completedOrder.petName}.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Modalidad:</span>
                    <span className="font-semibold text-slate-900">
                      {completedOrder.shippingMethod === 'pickup' ? 'Retiro en Farmacia Vetify (2h)' : 'Envío a domicilio'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Monto Total:</span>
                    <span className="font-bold text-slate-900 font-mono">${completedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Titular:</span>
                    <span className="font-medium text-slate-900">{completedOrder.recipientName}</span>
                  </div>
                </div>

                {completedOrder.items.some(i => i.product.requiresPrescription) && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-left flex items-start gap-2 text-xs text-amber-800">
                    <FileText size={16} className="text-amber-700 shrink-0 mt-0.5" weight="bold" />
                    <p className="text-[11px] leading-relaxed">
                      Este pedido incluye dietas o medicamentos clínicos. Nuestro equipo cotejará la cartilla médica de tu mascota antes de la entrega.
                    </p>
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <a
                    href={`https://wa.me/5491154893210?text=Hola%20Vetify,%20acabo%20de%20generar%20el%20pedido%20${completedOrder.id}%20para%20${encodeURIComponent(completedOrder.petName || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <WhatsappLogo size={16} weight="fill" />
                    Avisar a Guardia Farmacia por WhatsApp
                  </a>
                  <button
                    onClick={handleCloseAll}
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cerrar ventana
                  </button>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag size={24} />
                </div>
                <p className="text-sm font-medium text-slate-700">Tu canasto está vacío</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explora la sección de nutrición clínica, farmacia hospitalaria y accesorios ergonómicos.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 rounded-xl bg-forest text-white text-xs font-medium hover:bg-forest-light transition-colors cursor-pointer"
                >
                  Explorar Farmacia
                </button>
              </div>
            ) : (
              /* Items List */
              <>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div 
                      key={item.product.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-xs"
                    >
                      {/* Product Thumbnail */}
                      {item.product.imageUrl && (
                        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-mono uppercase text-slate-400">
                            {item.product.brand}
                          </span>
                          {item.product.requiresPrescription && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                              Rx
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-500">
                          ${item.product.price.toFixed(2)} / {item.product.unit}
                        </p>
                      </div>

                      {/* Quantity Selector & Subtotal */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-bold font-mono text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="text-right min-w-[55px]">
                          <span className="text-xs font-bold font-mono text-slate-900 block">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-[10px] text-rose-500 hover:text-rose-700 flex items-center gap-0.5 ml-auto mt-0.5 cursor-pointer"
                          >
                            <Trash size={11} />
                            <span>Quitar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prescription Warning Notice */}
                {hasPrescriptionItem && (
                  <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-2.5">
                    <FileText size={18} className="text-amber-700 shrink-0 mt-0.5" weight="bold" />
                    <div>
                      <span className="text-xs font-semibold text-amber-900 block">
                        Prescripción Médica Requerida
                      </span>
                      <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                        Al confirmar, farmacia validará automáticamente la historia clínica del paciente asignado en Vetify OS.
                      </p>
                    </div>
                  </div>
                )}

                {/* Delivery Options */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-slate-800 block">
                    Método de Entrega
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShippingMethod('pickup')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        shippingMethod === 'pickup'
                          ? 'border-forest bg-forest/5 text-forest font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock size={14} weight="bold" />
                        <span>Retiro Clínico</span>
                      </div>
                      <span className="text-[10px] font-mono block text-slate-500 mt-1">
                        Gratis · Listo en 2h
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShippingMethod('delivery')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        shippingMethod === 'delivery'
                          ? 'border-forest bg-forest/5 text-forest font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin size={14} weight="bold" />
                        <span>Envío Domicilio</span>
                      </div>
                      <span className="text-[10px] font-mono block text-slate-500 mt-1">
                        +$3.50 · 24-48h
                      </span>
                    </button>
                  </div>
                </div>

                {/* Patient & Contact Details */}
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-slate-800 block">
                    Datos del Paciente & Tutor
                  </label>
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 block mb-1">Mascota asignada</span>
                    <input
                      type="text"
                      value={petName}
                      onChange={e => setPetName(e.target.value)}
                      required
                      placeholder="Ej. Milo (Golden) / Luna (Gato)"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-medium text-slate-500 block mb-1">Tutor responsable</span>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={e => setRecipientName(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-slate-500 block mb-1">Teléfono</span>
                      <input
                        type="tel"
                        value={recipientPhone}
                        onChange={e => setRecipientPhone(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                      />
                    </div>
                  </div>

                  {shippingMethod === 'delivery' && (
                    <div>
                      <span className="text-[10px] font-medium text-slate-500 block mb-1">Dirección de entrega</span>
                      <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                        placeholder="Calle, número, piso/depto"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                      />
                    </div>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Footer with Totals and Submit button */}
          {!completedOrder && cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal productos:</span>
                  <span className="font-mono text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logística hospitalaria:</span>
                  <span className="font-mono text-slate-800">
                    {shippingFee === 0 ? 'Gratis' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Total estimado:</span>
                  <span className="font-mono text-forest">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={16} weight="bold" />
                <span>Confirmar Pedido a Farmacia (${total.toFixed(2)})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
