import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  MagnifyingGlass, 
  CheckCircle, 
  FileText, 
  Tag, 
  FirstAid, 
  Bone, 
  Dog, 
  Cat, 
  ShieldCheck,
  Plus
} from '@phosphor-icons/react';
import { StorageService } from '../../data/seedData';
import type { Product, ProductCategory } from '../../types';

interface StoreSectionProps {
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const StoreSection: React.FC<StoreSectionProps> = ({ 
  onAddToCart, 
  onOpenCart,
  cartCount 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todos');
  const [selectedSpecies, setSelectedSpecies] = useState<'Todos' | 'Canino' | 'Felino'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const products = useMemo(() => StorageService.getProducts(), []);

  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const matchCategory = selectedCategory === 'todos' || item.category === selectedCategory;
      const matchSpecies = selectedSpecies === 'Todos' || item.suitableFor === selectedSpecies || item.suitableFor === 'Ambos';
      const matchQuery = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSpecies && matchQuery;
    });
  }, [products, selectedCategory, selectedSpecies, searchQuery]);

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedNotice(product.id);
    setTimeout(() => {
      setAddedNotice(null);
    }, 1400);
  };

  return (
    <section id="tienda" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-forest block">
              Farmacia & Boutique Hospitalaria
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
              Nutrición Terapéutica, Farmacia y Bienestar Clínico
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Insumos médicos certificados, dietas de prescripción estricta y accesorios ergonómicos recomendados por el equipo veterinario de Vetify.
            </p>
          </div>

          {/* Floating / Header Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="self-start md:self-auto inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-forest text-white text-xs font-medium hover:bg-forest-light transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <ShoppingBag size={18} weight="bold" />
            <span>Mi Pedido Clínico</span>
            {cartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-forest text-[11px] font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'todos'
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                Todos ({products.length})
              </button>
              <button
                onClick={() => setSelectedCategory('alimentos')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'alimentos'
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Bone size={14} weight="bold" />
                Alimentos & Dietas Clínicas
              </button>
              <button
                onClick={() => setSelectedCategory('farmacia')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'farmacia'
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <FirstAid size={14} weight="bold" />
                Farmacia & Antiparasitarios
              </button>
              <button
                onClick={() => setSelectedCategory('accesorios')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'accesorios'
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Tag size={14} weight="bold" />
                Accesorios & Insumos
              </button>
            </div>

            {/* Species Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setSelectedSpecies('Todos')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedSpecies === 'Todos' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Especie: Todas
              </button>
              <button
                onClick={() => setSelectedSpecies('Canino')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedSpecies === 'Canino' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Dog size={12} weight="bold" />
                Caninos
              </button>
              <button
                onClick={() => setSelectedSpecies('Felino')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedSpecies === 'Felino' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Cat size={12} weight="bold" />
                Felinos
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por formulación, marca (ej. Royal Canin, Bravecto, Ruffwear) o síntoma..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-forest focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isAdded = addedNotice === product.id;
            return (
              <div 
                key={product.id}
                className="group bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <div>
                  {/* Product Image Container */}
                  <div className="relative aspect-square w-full rounded-xl bg-slate-50/80 overflow-hidden mb-4 border border-slate-100 group-hover:border-slate-200 transition-colors flex items-center justify-center">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingBag size={32} />
                      </div>
                    )}
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-forest text-[10px] font-bold shadow-xs border border-forest/15">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Brand & Unit */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
                      {product.brand}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {product.unit}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-forest transition-colors line-clamp-2 mb-1.5 leading-snug">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Prescription Requirement Alert */}
                  {product.requiresPrescription && (
                    <div className="mb-4 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2">
                      <FileText size={15} className="text-amber-700 shrink-0 mt-0.5" weight="bold" />
                      <div className="text-[11px] text-amber-800 leading-tight">
                        <span className="font-semibold block">Prescripción requerida</span>
                        Se verifica con la cartilla médica de tu paciente al preparar el pedido.
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing & Add to Cart */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-slate-900 tracking-tight font-mono">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                      <ShieldCheck size={12} weight="bold" />
                      <span>Stock hospitalario</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-forest text-white hover:bg-forest-light'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle size={14} weight="bold" />
                        <span>¡Agregado!</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} weight="bold" />
                        <span>Agregar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Feedback */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl">
            <p className="text-sm font-medium text-slate-700 mb-1">
              No se encontraron productos para los criterios seleccionados
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Prueba buscando por marca general o eliminando filtros de especie.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSelectedSpecies('Todos');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}

        {/* Clinical Transparency Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
              <FirstAid size={26} weight="duotone" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900">
                ¿Tu mascota requiere una dosis o formulación magistral no listada?
              </h4>
              <p className="text-xs text-slate-600">
                El laboratorio de Vetify prepara suspensiones orales saborizadas y cápsulas personalizadas por peso exacto.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/5491154893210?text=Hola%20Vetify,%20necesito%20consultar%20por%20un%20medicamento%20o%20dieta%20específica"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors shrink-0 text-center"
          >
            Consultar a Farmacia Hospitalaria
          </a>
        </div>
      </div>
    </section>
  );
};
