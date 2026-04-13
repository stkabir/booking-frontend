export interface ClientConfig {
  brand: {
    name: string;
    tagline: string;
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    siteUrl: string;
  };
  services: {
    hotels: boolean;
    tours: boolean;
    transfers: boolean;
  };
  location: {
    name: string;
    region: string;
    country: string;
    description: string;
    seoKeywords: string[];
  };
  contact: {
    phone: string;
    whatsapp: string;
    whatsappRaw: string;
    email: string;
    address: string;
    socialMedia: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };
  features: {
    enablePromoCodes: boolean;
  };
  api: {
    baseUrl: string;
    version: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}

// ─── Fallback desde env vars (usado si la API no responde) ───────────────────
const rawWhatsapp = import.meta.env.PUBLIC_WHATSAPP || '+52 998 123 4567';

export const defaultConfig: ClientConfig = {
  brand: {
    name:           import.meta.env.PUBLIC_BRAND_NAME      || 'Booking Caribe',
    tagline:        import.meta.env.PUBLIC_BRAND_TAGLINE   || 'Tours, hoteles y traslados en el Caribe Mexicano',
    logo:           import.meta.env.PUBLIC_LOGO_PATH       || '/logo.svg',
    favicon:        import.meta.env.PUBLIC_FAVICON_PATH    || '/favicon.svg',
    primaryColor:   import.meta.env.PUBLIC_COLOR_PRIMARY   || '#8B5CF6',
    secondaryColor: import.meta.env.PUBLIC_COLOR_SECONDARY || '#F472B6',
    accentColor:    import.meta.env.PUBLIC_COLOR_ACCENT    || '#FBBF24',
    siteUrl:        import.meta.env.PUBLIC_SITE_URL        || 'https://bookingcaribe.com',
  },
  services: {
    hotels:    import.meta.env.PUBLIC_SERVICE_HOTELS    !== 'false',
    tours:     import.meta.env.PUBLIC_SERVICE_TOURS     !== 'false',
    transfers: import.meta.env.PUBLIC_SERVICE_TRANSFERS !== 'false',
  },
  location: {
    name:        import.meta.env.PUBLIC_LOCATION_NAME    || 'Riviera Maya & Cancún',
    region:      import.meta.env.PUBLIC_LOCATION_REGION  || 'Quintana Roo',
    country:     import.meta.env.PUBLIC_LOCATION_COUNTRY || 'México',
    description: import.meta.env.PUBLIC_LOCATION_DESC    || 'Destino turístico de clase mundial en el Caribe Mexicano',
    seoKeywords: (import.meta.env.PUBLIC_SEO_KEYWORDS || 'tours cancun,hoteles riviera maya,traslado aeropuerto cancun').split(','),
  },
  contact: {
    phone:       import.meta.env.PUBLIC_PHONE   || '+52 998 123 4567',
    whatsapp:    rawWhatsapp,
    whatsappRaw: rawWhatsapp.replace(/\D/g, ''),
    email:       import.meta.env.PUBLIC_EMAIL   || 'reservas@bookingcaribe.com',
    address:     import.meta.env.PUBLIC_ADDRESS || 'Playa del Carmen, Quintana Roo, México',
    socialMedia: {
      facebook:  import.meta.env.PUBLIC_SOCIAL_FACEBOOK  || undefined,
      instagram: import.meta.env.PUBLIC_SOCIAL_INSTAGRAM || undefined,
      twitter:   import.meta.env.PUBLIC_SOCIAL_TWITTER   || undefined,
    },
  },
  features: {
    enablePromoCodes: import.meta.env.PUBLIC_ENABLE_PROMO_CODES !== 'false',
  },
  api: {
    baseUrl: import.meta.env.PUBLIC_API_URL || 'http://localhost:8000/api',
    version: 'v1',
  },
  analytics: {
    googleAnalyticsId: import.meta.env.PUBLIC_GA_ID    || undefined,
    facebookPixelId:   import.meta.env.PUBLIC_FB_PIXEL || undefined,
  },
};

// ─── Mapea la respuesta de /api/v1/config al tipo ClientConfig ───────────────
function mapApiResponse(data: Record<string, any>): ClientConfig {
  const rawWa = data.contact?.whatsapp || defaultConfig.contact.whatsapp;
  return {
    brand: {
      name:           data.brand?.name      || defaultConfig.brand.name,
      tagline:        data.brand?.tagline   || defaultConfig.brand.tagline,
      logo:           data.brand?.logo      || defaultConfig.brand.logo,
      favicon:        data.brand?.favicon   || defaultConfig.brand.favicon,
      primaryColor:   data.colors?.primary  || defaultConfig.brand.primaryColor,
      secondaryColor: data.colors?.secondary || defaultConfig.brand.secondaryColor,
      accentColor:    data.colors?.accent   || defaultConfig.brand.accentColor,
      siteUrl:        data.brand?.site_url  || defaultConfig.brand.siteUrl,
    },
    services: {
      hotels:    data.services?.hotels    ?? defaultConfig.services.hotels,
      tours:     data.services?.tours     ?? defaultConfig.services.tours,
      transfers: data.services?.transfers ?? defaultConfig.services.transfers,
    },
    location: {
      name:        data.location?.name        || defaultConfig.location.name,
      region:      data.location?.region      || defaultConfig.location.region,
      country:     data.location?.country     || defaultConfig.location.country,
      description: data.location?.description || defaultConfig.location.description,
      seoKeywords: Array.isArray(data.location?.seo_keywords)
        ? data.location.seo_keywords
        : defaultConfig.location.seoKeywords,
    },
    contact: {
      phone:       data.contact?.phone   || defaultConfig.contact.phone,
      whatsapp:    rawWa,
      whatsappRaw: rawWa.replace(/\D/g, ''),
      email:       data.contact?.email   || defaultConfig.contact.email,
      address:     data.contact?.address || defaultConfig.contact.address,
      socialMedia: {
        facebook:  data.contact?.social_media?.facebook  || undefined,
        instagram: data.contact?.social_media?.instagram || undefined,
        twitter:   data.contact?.social_media?.twitter   || undefined,
      },
    },
    features: {
      enablePromoCodes: data.features?.enable_promo_codes ?? defaultConfig.features.enablePromoCodes,
    },
    api: defaultConfig.api,
    analytics: {
      googleAnalyticsId: data.analytics?.google_analytics_id || undefined,
      facebookPixelId:   data.analytics?.facebook_pixel_id  || undefined,
    },
  };
}

// ─── Cache en módulo (persiste entre requests en SSR con Node) ───────────────
let _cache: ClientConfig | null = null;
let _cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // 60 segundos

export async function getClientConfig(): Promise<ClientConfig> {
  // Devolver cache si sigue vigente
  if (_cache && Date.now() - _cacheTimestamp < CACHE_TTL_MS) {
    return _cache;
  }

  try {
    const apiUrl = defaultConfig.api.baseUrl;
    const res = await fetch(`${apiUrl}/v1/config`, {
      signal: AbortSignal.timeout(3000), // 3 segundos máximo
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    _cache = mapApiResponse(json);
    _cacheTimestamp = Date.now();
    return _cache;

  } catch (err) {
    // API no disponible → usar env vars como fallback
    console.warn('[config] API no disponible, usando valores de entorno:', err);
    return defaultConfig;
  }
}
