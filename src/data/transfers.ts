import type { Transfer } from '../lib/api';

export const transfers: Transfer[] = [
  {
    id: 1,
    name: 'CUN → Zona Hotelera Cancún (Compartido)',
    slug: 'cun-zona-hotelera-cancun-compartido',
    description:
      'Traslado compartido económico desde el Aeropuerto Internacional de Cancún (CUN) hasta cualquier hotel de la Zona Hotelera. Servicio seguro y confiable, van moderna con A/A, conductor certificado. Tiempo de espera máximo 20 minutos para reunir el grupo.',
    from_location: 'Aeropuerto Cancún (CUN)',
    to_location: 'Zona Hotelera Cancún',
    type: 'aeropuerto',
    vehicle_type: 'Van compartida',
    max_passengers: 10,
    price: 320,
    is_private: false,
    features: [
      'Van con A/A',
      'Conductor certificado',
      'Seguimiento de vuelo',
      'Espera en caso de retraso',
      'WiFi a bordo',
      'Equipaje incluido',
    ],
    is_active: true,
    featured: true,
  },
  {
    id: 2,
    name: 'CUN → Playa del Carmen (Compartido)',
    slug: 'cun-playa-del-carmen-compartido',
    description:
      'Traslado compartido desde el Aeropuerto de Cancún hasta Playa del Carmen, con paradas en los principales hoteles y la Quinta Avenida. Servicio puntual, van climatizada y conductor con años de experiencia en el corredor turístico. Aprox. 1h de trayecto.',
    from_location: 'Aeropuerto Cancún (CUN)',
    to_location: 'Playa del Carmen',
    type: 'aeropuerto',
    vehicle_type: 'Van compartida',
    max_passengers: 10,
    price: 420,
    is_private: false,
    features: [
      'Van con A/A',
      'Paradas en principales hoteles',
      'Conductor certificado',
      'Seguimiento de vuelo',
      'WiFi a bordo',
      'Equipaje incluido',
      '~1h de trayecto',
    ],
    is_active: true,
    featured: true,
  },
  {
    id: 3,
    name: 'CUN → Tulum (Privado)',
    slug: 'cun-tulum-privado',
    description:
      'Traslado privado exclusivo desde el Aeropuerto de Cancún hasta tu hotel, villa o airbnb en Tulum. Suburban o van de lujo con chofer uniformado, agua fría, toallas y sistema de seguimiento de vuelo en tiempo real. No compartes el vehículo con nadie más. Aprox. 1h 40min de trayecto.',
    from_location: 'Aeropuerto Cancún (CUN)',
    to_location: 'Tulum',
    type: 'aeropuerto',
    vehicle_type: 'Suburban / Van ejecutiva',
    max_passengers: 6,
    price: 1400,
    is_private: true,
    features: [
      'Vehículo privado exclusivo',
      'Chofer uniformado',
      'Agua fría y toallas',
      'Seguimiento de vuelo en tiempo real',
      'Sin esperas',
      'Recogida en sala de llegadas',
      'Servicio hasta el destino exacto',
      '~1h 40min de trayecto',
    ],
    is_active: true,
    featured: true,
  },
  {
    id: 4,
    name: 'CUN → Riviera Maya Hoteles (Privado)',
    slug: 'cun-riviera-maya-privado',
    description:
      'Traslado privado desde el Aeropuerto de Cancún hacia cualquier resort o hotel en la Riviera Maya (Puerto Morelos, Akumal, Xpu-Ha, Kantenah). Van ejecutiva con A/A, asientos reclinables, monitor de vuelo y chofer bilingüe. El servicio más cómodo para llegar a tu resort sin estrés.',
    from_location: 'Aeropuerto Cancún (CUN)',
    to_location: 'Riviera Maya (Puerto Morelos, Akumal, Xpu-Ha)',
    type: 'aeropuerto',
    vehicle_type: 'Van ejecutiva',
    max_passengers: 8,
    price: 950,
    is_private: true,
    features: [
      'Van ejecutiva privada',
      'Chofer bilingüe',
      'Monitor de seguimiento de vuelo',
      'Agua y snacks de bienvenida',
      'Sin paradas adicionales',
      'Asientos reclinables con A/A',
      'Cargo incluido hasta cualquier resort',
    ],
    is_active: true,
    featured: false,
  },
  {
    id: 5,
    name: 'Playa del Carmen → CUN (Compartido)',
    slug: 'playa-del-carmen-cun-compartido',
    description:
      'Traslado compartido de regreso desde tu hotel en Playa del Carmen hasta el Aeropuerto Internacional de Cancún. Reserva con anticipación para garantizar tu lugar. Recogida en hotel con 3h antes de tu vuelo. Van con A/A, conductor puntual y acompañamiento hasta la terminal.',
    from_location: 'Playa del Carmen',
    to_location: 'Aeropuerto Cancún (CUN)',
    type: 'aeropuerto',
    vehicle_type: 'Van compartida',
    max_passengers: 10,
    price: 420,
    is_private: false,
    features: [
      'Recogida en tu hotel',
      'Van con A/A',
      'Conductor puntual certificado',
      'Entrega en la terminal correcta',
      'Tiempo calculado para check-in',
      'Equipaje incluido',
      '~1h de trayecto',
    ],
    is_active: true,
    featured: false,
  },
];

export function getTransfer(slug: string): Transfer | undefined {
  return transfers.find(t => t.slug === slug);
}

export function getFeaturedTransfers(): Transfer[] {
  return transfers.filter(t => t.featured && t.is_active);
}
