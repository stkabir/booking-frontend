import type { Tour } from '../lib/api';

export const tours: Tour[] = [
  {
    id: 1,
    name: 'Chichén Itzá Premium con Cenote',
    slug: 'chichen-itza-premium-con-cenote',
    description:
      'Visita la Séptima Maravilla del Mundo Moderno con un guía arqueólogo certificado. Recorrido exclusivo por la pirámide de Kukulcán, el Templo de los Guerreros y el campo de juego de pelota. Incluye parada en un cenote natural para nadar y almuerzo buffet en restaurante típico yucateco.',
    highlights:
      'Guía arqueólogo certificado · Entrada incluida · Cenote natural · Almuerzo buffet · Transporte A/C · Grupos máx. 12 personas',
    destination: 'Chichén Itzá, Yucatán',
    duration: '10 horas',
    max_people: 12,
    price_adult: 1350,
    price_child: 850,
    included: [
      'Transporte con A/A desde tu hotel',
      'Guía arqueólogo certificado bilingüe',
      'Entrada a zona arqueológica',
      'Acceso a cenote (equipo incluido)',
      'Almuerzo buffet regional',
      'Agua y refrescos durante el tour',
      'Seguro de viajero',
    ],
    not_included: [
      'Propinas (opcionales)',
      'Souvenirs y artesanías',
      'Bebidas alcohólicas',
      'Fotografía profesional',
    ],
    itinerary:
      '7:00 Recogida en hotel · 10:30 Llegada Chichén Itzá · 10:30–12:30 Recorrido zona arqueológica · 13:00 Almuerzo buffet · 14:30 Cenote natural · 16:00 Regreso · 19:00 Llegada hotel',
    meeting_point: 'Lobby de tu hotel en Cancún, Playa del Carmen o Riviera Maya',
    difficulty_level: 'fácil',
    is_active: true,
    featured: true,
    latitude: 20.6843,
    longitude: -88.5678,
  },
  {
    id: 2,
    name: 'Snorkel Arrecife de Cozumel',
    slug: 'snorkel-arrecife-cozumel',
    description:
      'Explora el segundo arrecife de coral más grande del mundo en las aguas cristalinas de Cozumel. Tres paradas de snorkel en los arrecifes más coloridos, incluyendo el famoso Palancar y Colombia Shallows. Equipo de buceo de primera calidad, instructor certificado PADI y almuerzo a bordo.',
    highlights:
      'Tres spots de snorkel · Arrecife Palancar · Equipo incluido · Instructor PADI · Almuerzo a bordo · Visibilidad hasta 30m',
    destination: 'Cozumel',
    duration: '6 horas',
    max_people: 16,
    price_adult: 1050,
    price_child: 650,
    included: [
      'Ferry de ida y vuelta Playa–Cozumel',
      'Bote privado con capitán',
      'Instructor PADI certificado',
      'Equipo de snorkel completo',
      'Chaleco salvavidas',
      'Almuerzo a bordo (ceviche, tacos)',
      'Bebidas (agua, refrescos, cerveza)',
      'Seguro acuático',
    ],
    not_included: [
      'Traje de neopreno (renta $150)',
      'Cámara subacuática (renta $200)',
      'Propinas',
      'Transfer desde Cancún',
    ],
    itinerary:
      '8:00 Salida ferry Playa del Carmen · 9:00 Llegada Cozumel · 9:30 Primer spot snorkel · 11:00 Segundo spot snorkel · 12:30 Almuerzo a bordo · 13:30 Tercer spot snorkel · 15:00 Regreso ferry · 16:00 Arribo Playa del Carmen',
    meeting_point: 'Muelle de Cozumel, Playa del Carmen (ferry incluido)',
    difficulty_level: 'fácil',
    is_active: true,
    featured: true,
    latitude: 20.4229,
    longitude: -86.9224,
  },
  {
    id: 3,
    name: 'Cenotes Ruta Secreta',
    slug: 'cenotes-ruta-secreta',
    description:
      'Descubre tres cenotes únicos alejados de las rutas turísticas masivas: un cenote abierto, uno semisubterráneo y una caverna submarina iluminada por la luz del sol. Nado en aguas cristalinas de hasta 100 metros de profundidad, rope swing, y snorkel en el sistema de cuevas más extenso del mundo.',
    highlights:
      'Tres cenotes distintos · Caverna submarina · Rope swing · Sin multitudes · Guía local · Solo 8 personas por grupo',
    destination: 'Riviera Maya',
    duration: '5 horas',
    max_people: 8,
    price_adult: 850,
    price_child: 550,
    included: [
      'Transporte privado A/A',
      'Guía local especializado',
      'Equipo de snorkel',
      'Chaleco salvavidas',
      'Entrada a los tres cenotes',
      'Fruta fresca y agua de coco',
      'Repelente natural',
    ],
    not_included: [
      'Propinas',
      'Ropa de cambio (recomendado traer)',
      'Cámara acuática',
      'Desayuno previo al tour',
    ],
    itinerary:
      '8:00 Recogida hotel · 9:30 Cenote Ik Kil estilo (abierto) · 11:00 Cenote semisubterráneo · 12:30 Cenote caverna · 13:30 Merienda local · 14:30 Regreso · 15:30 Arribo hotel',
    meeting_point: 'Lobby de tu hotel en Playa del Carmen, Tulum o Riviera Maya',
    difficulty_level: 'moderado',
    is_active: true,
    featured: false,
    latitude: 20.4967,
    longitude: -87.1667,
  },
  {
    id: 4,
    name: 'Tulum Arqueológico + Playa del Carmen',
    slug: 'tulum-arqueologico-playa-del-carmen',
    description:
      'Visita las únicas ruinas mayas sobre un acantilado con vista al mar Caribe, consideradas las más fotogénicas del mundo maya. Incluye tiempo libre en la playa turquesa al pie de las ruinas, tarde en el mercado artesanal y paseo por la Quinta Avenida de Playa del Carmen con sus bares y restaurantes.',
    highlights:
      'Ruinas mayas con vista al mar · Playa al pie de las ruinas · Quinta Avenida · Guía experto · Tiempo libre garantizado',
    destination: 'Tulum',
    duration: '8 horas',
    max_people: 20,
    price_adult: 920,
    price_child: 580,
    included: [
      'Transporte con A/A',
      'Guía certificado bilingüe',
      'Entrada a zona arqueológica Tulum',
      'Tiempo libre en la playa',
      'Parada en Playa del Carmen (5ta Av)',
      'Agua durante el recorrido',
      'Seguro de viajero',
    ],
    not_included: [
      'Almuerzo (tiempo libre para comer)',
      'Souvenirs',
      'Propinas',
      'Actividades en la playa',
    ],
    itinerary:
      '7:30 Recogida hotel Cancún/PDC · 9:30 Arribo Tulum Arqueológico · 9:30–11:30 Recorrido guiado · 11:30–13:00 Tiempo libre en la playa · 13:00 Salida a Playa del Carmen · 14:00–16:00 Tiempo libre Quinta Avenida · 16:00 Regreso · 17:30 Arribo hotel',
    meeting_point: 'Lobby de tu hotel en Cancún o Riviera Maya',
    difficulty_level: 'fácil',
    is_active: true,
    featured: false,
    latitude: 20.2140,
    longitude: -87.4288,
  },
  {
    id: 5,
    name: 'Nado con Tiburones Ballena en Holbox',
    slug: 'nado-tiburones-ballena-holbox',
    description:
      'Experimenta una de las aventuras más impresionantes del mundo: nadar junto a los peces más grandes del planeta en su hábitat natural. Los tiburones ballena (completamente inofensivos) congregan en las aguas de Holbox entre junio y septiembre. Biólogo marino a bordo, fotos y video incluidos.',
    highlights:
      'Temporada junio–septiembre · Biólogo marino · Foto y video incluidos · Embarcación privada · Experiencia única en el mundo',
    destination: 'Isla Holbox',
    duration: '7 horas',
    max_people: 10,
    price_adult: 1580,
    price_child: null,
    included: [
      'Transporte desde Cancún/PDC',
      'Ferry a Isla Holbox',
      'Embarcación privada',
      'Equipo de snorkel',
      'Chaleco salvavidas',
      'Biólogo marino certificado',
      'Fotografía y video del tour',
      'Almuerzo en Holbox',
      'Seguro acuático',
    ],
    not_included: [
      'No apto para menores de 8 años',
      'Propinas',
      'No garantizado (depende avistamiento)',
    ],
    itinerary:
      '6:00 Salida Cancún · 8:30 Ferry Chiquila–Holbox · 9:30 Briefing y salida en lancha · 10:00–12:30 Nado con tiburones ballena · 13:00 Almuerzo en Holbox · 14:30 Ferry de regreso · 17:30 Arribo Cancún',
    meeting_point: 'Hotel en Cancún o punto de encuentro en Chiquila (opción propia)',
    difficulty_level: 'moderado',
    is_active: true,
    featured: true,
    latitude: 21.5244,
    longitude: -87.3708,
  },
  {
    id: 6,
    name: 'Xcaret: Maravilla Natural de México',
    slug: 'xcaret-maravilla-natural-mexico',
    description:
      'El parque eco-arqueológico más famoso de México te espera con más de 50 actividades naturales y culturales. Nada en ríos subterráneos mayas, visita el acuario de arrecife, recorre la aldea maya prehispánica y disfruta del espectacular show nocturno "México Espectacular" con 300 artistas en escena.',
    highlights:
      'Más de 50 atracciones · Río subterráneo maya · Acuario de arrecife · Show nocturno incluido · Transporte A/A · Todo el día',
    destination: 'Playa del Carmen',
    duration: '12 horas',
    max_people: 30,
    price_adult: 1850,
    price_child: 1200,
    included: [
      'Transporte redondo desde tu hotel',
      'Admisión Plus al parque',
      'Acceso a todas las atracciones acuáticas',
      'Show "México Espectacular"',
      'Casillero para pertenencias',
      'Chaleco salvavidas',
      'Snorkel en el arrecife',
      'Acceso a playa privada',
    ],
    not_included: [
      'Alimentos y bebidas dentro del parque',
      'Actividades de pago adicional (zip line, buceo)',
      'Propinas',
      'Fotografía profesional dentro del parque',
    ],
    itinerary:
      '8:00 Recogida en hotel · 9:30 Apertura parque · 9:30–14:00 Actividades acuáticas y naturales · 14:00–15:30 Almuerzo libre · 15:30–18:00 Aldea maya, show de voladores · 19:00–21:00 México Espectacular · 21:30 Regreso al hotel',
    meeting_point: 'Lobby de tu hotel en Cancún, Playa del Carmen o Riviera Maya',
    difficulty_level: 'fácil',
    is_active: true,
    featured: false,
    latitude: 20.5788,
    longitude: -87.1198,
  },
];

export function getTour(slug: string): Tour | undefined {
  return tours.find(t => t.slug === slug);
}

export function getFeaturedTours(): Tour[] {
  return tours.filter(t => t.featured && t.is_active);
}
