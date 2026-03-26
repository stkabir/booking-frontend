import { useState } from 'react';
import HotelFilters from './filters/HotelFilters';
import type { Hotel } from '../lib/api';

interface HotelListProps {
  initialHotels: Hotel[];
}

export default function HotelList({ initialHotels }: HotelListProps) {
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(initialHotels);

  return (
    <div className="space-y-6">
      <HotelFilters hotels={initialHotels} onFilter={setFilteredHotels} />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500">
          <span className="font-black text-slate-800">{filteredHotels.length}</span>{' '}
          {filteredHotels.length === 1 ? 'hotel encontrado' : 'hoteles encontrados'}
        </p>
      </div>

      {/* Hotels Grid */}
      {filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white border-2 border-slate-800 shadow-[4px_4px_0px_0px_#1E293B] rounded-2xl overflow-hidden
                         transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[7px_7px_0px_0px_#1E293B]"
            >
              {/* Hotel Image */}
              <figure className="h-52 bg-emerald-100 relative overflow-hidden">
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #6ee7b7 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                {/* Emoji placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">🏨</div>
                {/* Featured badge */}
                {hotel.featured && (
                  <div className="absolute top-3 right-3 bg-pink-400 text-white text-xs font-black px-3 py-1 rounded-full border-2 border-slate-800 shadow-[2px_2px_0px_0px_#1E293B]">
                    ✦ Destacado
                  </div>
                )}
                {/* Stars overlay */}
                <div className="absolute bottom-3 left-3 flex gap-0.5">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 fill-amber-400 drop-shadow" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </figure>

              <div className="p-5">
                <h2 className="font-black text-lg leading-snug text-slate-800 mb-0.5">{hotel.name}</h2>

                <p className="text-sm text-slate-500 line-clamp-2 mt-0.5">{hotel.description}</p>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-slate-400 font-medium mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {hotel.city}, {hotel.state}
                </div>

                {/* Amenities */}
                {hotel.amenities && (() => {
                  const amenities: string[] = (() => {
                    try { return Array.isArray(hotel.amenities) ? hotel.amenities as string[] : JSON.parse(hotel.amenities as unknown as string); }
                    catch { return []; }
                  })();
                  return amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {amenities.slice(0, 3).map((amenity, i) => (
                        <span
                          key={i}
                          className="text-xs font-semibold px-2 py-0.5 rounded-full border-2 border-slate-200 text-slate-500 bg-slate-50"
                        >
                          {amenity}
                        </span>
                      ))}
                      {amenities.length > 3 && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border-2 border-slate-200 text-slate-400">
                          +{amenities.length - 3}
                        </span>
                      )}
                    </div>
                  ) : null;
                })()}

                <div className="border-t-2 border-slate-100 my-3" />

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Por noche desde</p>
                    <span
                      className="text-2xl font-black"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6, #F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >
                      ${hotel.price_per_night.toLocaleString('es-MX')}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">MXN</span>
                  </div>
                  <a
                    href={`/hotels/${hotel.slug}`}
                    className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-sm font-black px-4 py-2 rounded-full border-2 border-slate-800 shadow-[3px_3px_0px_0px_#1E293B]
                               hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#1E293B] active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_0px_#1E293B]
                               transition-all duration-150"
                  >
                    Ver hotel
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 border-2 border-slate-800 shadow-[4px_4px_0px_0px_#1E293B] rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
            🏨
          </div>
          <h3 className="text-2xl font-black text-slate-800">No se encontraron hoteles</h3>
          <p className="text-slate-400 font-medium mt-2">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}
