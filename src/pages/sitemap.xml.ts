import type { APIRoute } from 'astro';
import { api } from '../lib/api';

const SITE_URL = 'https://bookingcaribe.com';

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/tours', priority: '0.9', changefreq: 'daily' },
  { url: '/hotels', priority: '0.9', changefreq: 'daily' },
  { url: '/transfers', priority: '0.9', changefreq: 'daily' },
  { url: '/about', priority: '0.6', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
];

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().split('T')[0];

  // Fetch dynamic pages
  let tourUrls: string[] = [];
  let hotelUrls: string[] = [];
  let transferUrls: string[] = [];

  try {
    const [tours, hotels, transfers] = await Promise.allSettled([
      api.getTours(),
      api.getHotels(),
      api.getTransfers(),
    ]);

    if (tours.status === 'fulfilled') {
      tourUrls = tours.value.map((t) => `/tours/${t.slug}`);
    }
    if (hotels.status === 'fulfilled') {
      hotelUrls = hotels.value.map((h) => `/hotels/${h.slug}`);
    }
    if (transfers.status === 'fulfilled') {
      transferUrls = transfers.value.map((t) => `/transfers/${t.slug}`);
    }
  } catch {
    // Sitemap still works with just static pages
  }

  const dynamicPages = [
    ...tourUrls.map((url) => ({ url, priority: '0.8', changefreq: 'weekly' })),
    ...hotelUrls.map((url) => ({ url, priority: '0.8', changefreq: 'weekly' })),
    ...transferUrls.map((url) => ({ url, priority: '0.8', changefreq: 'weekly' })),
  ];

  const allPages = [...staticPages, ...dynamicPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    ({ url, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
