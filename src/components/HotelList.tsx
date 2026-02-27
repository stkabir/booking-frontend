import { useState } from 'react';
import HotelFilters from './filters/HotelFilters';
import type { Hotel } from '../lib/api';

interface HotelListProps {
  initialHotels: Hotel[];
}

export default function HotelList({ initialHotels }: HotelListProps) {
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(initialHotels);

  return (
    <div className="space-y-8">
      <HotelFilters hotels={initialHotels} onFilter={setFilteredHotels} />

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-base-content/70">
          <span className="font-bold text-base-content">{filteredHotels.length}</span> {filteredHotels.length === 1 ? 'hotel encontrado' : 'hoteles encontrados'}
        </p>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="card bg-base-100 shadow-md border border-base-200 card-lift"
          >
            {/* Hotel Image Placeholder */}
            <figure className="h-52 bg-gradient-to-br from-cyan-400 to-teal-600 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-white/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              {hotel.featured && (
                <div className="badge badge-secondary absolute top-3 right-3 shadow">Destacado</div>
              )}
              <div className="absolute bottom-3 left-3">
                <div className="flex gap-0.5">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </figure>

            <div className="card-body p-5">
              <h2 className="font-bold text-lg leading-snug">{hotel.name}</h2>

              <p className="text-sm text-base-content/65 line-clamp-2 mt-0.5">{hotel.description}</p>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-sm text-base-content/60 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
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
                  <div className="flex flex-wrap gap-1 mt-2">
                    {amenities.slice(0, 3).map((amenity, i) => (
                      <div key={i} className="badge badge-outline badge-sm">{amenity}</div>
                    ))}
                    {amenities.length > 3 && (
                      <div className="badge badge-outline badge-sm">+{amenities.length - 3}</div>
                    )}
                  </div>
                ) : null;
              })()}

              <div className="divider my-2"></div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold price-gradient">
                    ${hotel.price_per_night.toLocaleString('es-MX')}
                  </span>
                  <span className="text-xs text-base-content/50 ml-1">MXN / noche</span>
                </div>
                <a href={`/hotels/${hotel.slug}`} className="btn btn-primary btn-sm rounded-xl">
                  Ver hotel
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredHotels.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-base-content/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold">No se encontraron hoteles</h3>
          <p className="text-base-content/60 mt-2">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}
