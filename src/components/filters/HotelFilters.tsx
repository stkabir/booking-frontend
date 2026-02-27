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

  // Extract unique cities from hotels
  const cities = [...new Set(hotels.map((h) => h.city))];

  useEffect(() => {
    let filtered = [...hotels];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply city filter
    if (selectedCity) {
      filtered = filtered.filter((hotel) => hotel.city === selectedCity);
    }

    // Apply stars filter
    if (selectedStars) {
      filtered = filtered.filter((hotel) => hotel.stars === parseInt(selectedStars));
    }

    // Apply price range filter
    if (priceRange) {
      filtered = filtered.filter((hotel) => {
        const price = hotel.price_per_night;
        switch (priceRange) {
          case 'low':
            return price < 1000;
          case 'medium':
            return price >= 1000 && price <= 2000;
          case 'high':
            return price > 2000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price_per_night - b.price_per_night);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price_per_night - a.price_per_night);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
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

  return (
    <div className="space-y-5">
      {/* Filters Card */}
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros
            </h3>
            <button onClick={handleReset} className="btn btn-ghost btn-sm text-xs gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpiar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-semibold text-xs uppercase tracking-wide">Buscar</span>
              </label>
              <input
                type="text"
                placeholder="Nombre del hotel..."
                className="input input-bordered input-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* City Filter */}
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-semibold text-xs uppercase tracking-wide">Ciudad</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Todas las ciudades</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Stars Filter */}
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-semibold text-xs uppercase tracking-wide">Categoría</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={selectedStars}
                onChange={(e) => setSelectedStars(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                <option value="5">5 estrellas ★★★★★</option>
                <option value="4">4 estrellas ★★★★</option>
                <option value="3">3 estrellas ★★★</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-semibold text-xs uppercase tracking-wide">Precio / noche</span>
              </label>
              <select
                className="select select-bordered select-sm"
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
      </div>

      {/* Sort Selector */}
      <div className="flex justify-end">
        <select
          className="select select-bordered select-sm w-auto"
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
  );
}
