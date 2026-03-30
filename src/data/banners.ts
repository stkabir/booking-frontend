import type { Banner } from '../lib/api';

export const banners: Banner[] = [
  {
    id: 1,
    title: 'El Caribe Mexicano te espera',
    subtitle: 'Tours, hoteles y traslados en Riviera Maya y Cancún. Más de 5,000 viajeros felices.',
    description:
      'Descubre la magia del Caribe Mexicano con los mejores precios garantizados. Chichén Itzá, cenotes, Cozumel, Tulum y más destinos icónicos te esperan.',
    button_text: 'Ver tours y actividades',
    button_url: '/tours',
    position: 'home',
    order: 1,
    is_active: true,
  },
  {
    id: 2,
    title: '¡Verano 2026 — 15% de descuento!',
    subtitle: 'Usa el código VERANO2026 y ahorra en tu próxima reserva.',
    description:
      'Aprovecha nuestra promoción de temporada: 15% de descuento en todos los tours, hoteles y traslados. Válido hasta el 30 de septiembre de 2026.',
    button_text: 'Reservar ahora',
    button_url: '/tours',
    position: 'home',
    order: 2,
    is_active: true,
  },
];

export function getBanners(position: string = 'home'): Banner[] {
  return banners.filter(b => b.position === position && b.is_active);
}
