import type { APIRoute } from 'astro';
import { hotels } from '../data/hotels';
import { tours } from '../data/tours';
import { transfers } from '../data/transfers';

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

export const GET: APIRoute = () => {
  const today = new Date().toISOString().split('T')[0];

  const tourUrls = tours.filter(t => t.is_active).map(t => `/tours/${t.slug}`);
  const hotelUrls = hotels.filter(h => h.is_active).map(h => `/hotels/${h.slug}`);
  const transferUrls = transfers.filter(t => t.is_active).map(t => `/transfers/${t.slug}`);

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
