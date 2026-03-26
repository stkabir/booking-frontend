import { useState, useEffect } from 'react';
import type { Hotel } from '../../lib/api';

interface HotelFiltersProps {
  hotels: Hotel[];
  onFilter: (filtered: Hotel[]) => void;
}

export default function HotelFilters({ hotels, onFilter }: HotelFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStars, setSelectedStars] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const cities = [...new Set(hotels.map((h) => h.city))];

  const inputCls = `w-full h-10 px-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 text-sm font-medium
    focus:outline-none focus:border-emerald-500 focus:shadow-[3px_3px_0px_0px_#10B981] transition-all placeholder:text-slate-400 placeholder:font-normal`;

  const selectCls = `w-full h-10 px-4 pr-9 bg-white border-2 border-slate-200 rounded-xl text-slate-800 text-sm font-medium appearance-none
    focus:outline-none focus:border-emerald-500 focus:shadow-[3px_3px_0px_0px_#10B981] transition-all`;

  const labelCls = 'block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5';

  useEffect(() => {
    let filtered = [...hotels];

    if (searchTerm) {
      filtered = filtered.filter((h) =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCity) {
      filtered = filtered.filter((h) => h.city === selectedCity);
    }
    if (selectedStars) {
      filtered = filtered.filter((h) => h.stars === parseInt(selectedStars));
    }
    if (priceRange) {
      filtered = filtered.filter((h) => {
        const p = h.price_per_night;
        if (priceRange === 'low') return p < 1000;
        if (priceRange === 'medium') return p >= 1000 && p <= 2000;
        if (priceRange === 'high') return p > 2000;
        return true;
      });
    }

    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price_per_night - b.price_per_night); break;
      case 'price-desc': filtered.sort((a, b) => b.price_per_night - a.price_per_night); break;
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    onFilter(filtered);
  }, [searchTerm, selectedCity, selectedStars, priceRange, sortBy, hotels, onFilter]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedStars('');
    setPriceRange('');
    setSortBy('featured');
  };

  // Custom select arrow SVG as background
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%231E293B' d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '12px',
  };

  return (
    <div className="space-y-4">
      {/* Filters Card */}
      <div className="bg-white border-2 border-slate-800 shadow-[4px_4px_0px_0px_#1E293B] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
            <span className="w-7 h-7 bg-emerald-500 rounded-lg border-2 border-slate-800 shadow-[2px_2px_0px_0px_#1E293B] flex items-center justify-center text-white text-xs">
              ⚡
            </span>
            Filtrar hoteles
          </h3>
          <button
            onClick={handleReset}
            className="text-xs font-bold text-slate-400 hover:text-slate-800 border-2 border-transparent hover:border-slate-200 px-3 py-1.5 rounded-full transition-all"
          >
            ↺ Limpiar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className={labelCls}>Buscar</label>
            <input
              type="text"
              placeholder="Nombre del hotel..."
              className={inputCls}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* City */}
          <div>
            <label className={labelCls}>Ciudad</label>
            <select
              className={selectCls}
              style={selectStyle}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Todas las ciudades</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Stars */}
          <div>
            <label className={labelCls}>Categoría</label>
            <select
              className={selectCls}
              style={selectStyle}
              value={selectedStars}
              onChange={(e) => setSelectedStars(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="5">5 estrellas ★★★★★</option>
              <option value="4">4 estrellas ★★★★</option>
              <option value="3">3 estrellas ★★★</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className={labelCls}>Precio / noche</label>
            <select
              className={selectCls}
              style={selectStyle}
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">Cualquier precio</option>
              <option value="low">Hasta $1,000 MXN</option>
              <option value="medium">$1,000 – $2,000 MXN</option>
              <option value="high">Más de $2,000 MXN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sort Row */}
      <div className="flex justify-end">
        <div className="relative">
          <select
            className="h-10 pl-4 pr-9 bg-white border-2 border-slate-800 shadow-[3px_3px_0px_0px_#1E293B] rounded-full text-slate-800 text-sm font-bold appearance-none
              focus:outline-none focus:border-emerald-500 focus:shadow-[3px_3px_0px_0px_#10B981] transition-all"
            style={selectStyle}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Ordenar: Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name">Nombre: A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
