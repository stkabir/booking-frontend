import { c as createComponent, i as renderComponent, r as renderTemplate, f as createAstro, m as maybeRenderHead } from '../../chunks/astro/server_ir7vVYZ-.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_t02fJaQN.mjs';
import { B as BookingForm } from '../../chunks/BookingForm_DxtdJ6x6.mjs';
import { a as api } from '../../chunks/api_D4Nf1iaX.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  let hotel = null;
  try {
    hotel = await api.getHotel(slug);
  } catch {
    return Astro2.redirect("/hotels");
  }
  if (!hotel) return Astro2.redirect("/hotels");
  const amenities = (() => {
    try {
      return hotel.amenities ? JSON.parse(hotel.amenities) : [];
    } catch {
      return hotel.amenities || [];
    }
  })();
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address,
      addressLocality: hotel.city,
      addressRegion: hotel.state,
      addressCountry: "MX"
    },
    starRating: { "@type": "Rating", ratingValue: hotel.stars },
    priceRange: `$${hotel.price_per_night} MXN por noche`,
    url: `https://bookingcaribe.com/hotels/${hotel.slug}`
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${hotel.name} - Hotel en ${hotel.city}`, "description": `Reserva ${hotel.name} en ${hotel.city}, ${hotel.state}. ${hotel.stars} estrellas. Desde $${hotel.price_per_night.toLocaleString("es-MX")} MXN por noche. ${hotel.description?.slice(0, 120) || ""}`, "keywords": `${hotel.name}, hotel ${hotel.city}, alojamiento ${hotel.city}, hotel ${hotel.state}, reservar ${hotel.name}`, "schema": hotelSchema }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="bg-base-200 py-3 border-b border-base-300"> <div class="container mx-auto px-4"> <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-base-content/60"> <a href="/" class="hover:text-primary transition-colors">Inicio</a> <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> <a href="/hotels" class="hover:text-primary transition-colors">Hoteles</a> <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> <span class="text-base-content font-medium truncate max-w-[200px]">${hotel.name}</span> </nav> </div> </div> <div class="container mx-auto px-4 py-10"> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"> <!-- Main Content --> <div class="lg:col-span-2 space-y-8"> <!-- Header --> <div class="reveal-up"> <div class="flex flex-wrap items-start justify-between gap-4 mb-3"> <div> <h1 class="text-3xl md:text-4xl font-bold leading-tight">${hotel.name}</h1> <div class="flex items-center gap-3 mt-2"> <div class="flex"> ${[...Array(hotel.stars)].map(() => renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>`)} </div> ${hotel.featured && renderTemplate`<span class="badge badge-secondary badge-sm">Destacado</span>`} </div> </div> </div> <div class="flex items-center gap-2 text-base-content/60 text-sm"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> ${hotel.address ? `${hotel.address}, ` : ""}${hotel.city}${hotel.state ? `, ${hotel.state}` : ""}, ${hotel.country} </div> </div> <!-- Image Placeholder --> <div class="reveal-up delay-100 h-72 md:h-96 rounded-2xl overflow-hidden relative"> <div class="absolute inset-0 bg-gradient-to-br from-sky-400 via-cyan-500 to-teal-600"></div> <div class="absolute inset-0 flex flex-col items-center justify-center text-white/30"> <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path> </svg> <p class="mt-3 text-sm font-medium">Foto del hotel próximamente</p> </div> <!-- Decorative elements --> <div class="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/10 blur-xl"></div> <div class="absolute bottom-8 left-8 w-32 h-32 rounded-full bg-cyan-300/10 blur-2xl"></div> </div> <!-- Description --> <div class="reveal-up delay-100"> <h2 class="text-2xl font-bold mb-4">Acerca del Hotel</h2> <p class="text-base-content/70 leading-relaxed">${hotel.description}</p> </div> <!-- Amenities --> ${amenities.length > 0 && renderTemplate`<div class="reveal-up delay-200"> <h2 class="text-2xl font-bold mb-5">Servicios e Instalaciones</h2> <div class="grid grid-cols-2 sm:grid-cols-3 gap-3"> ${amenities.map((amenity) => renderTemplate`<div class="flex items-center gap-2.5 p-3 bg-base-200 rounded-xl text-sm"> <div class="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center shrink-0"> <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path> </svg> </div> <span class="font-medium">${amenity}</span> </div>`)} </div> </div>`} <!-- Map placeholder --> ${hotel.latitude && hotel.longitude && renderTemplate`<div class="reveal-up delay-200"> <h2 class="text-2xl font-bold mb-4">Ubicación</h2> <div class="h-52 bg-base-200 rounded-2xl flex flex-col items-center justify-center text-base-content/40 border border-base-300"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path> </svg> <p class="text-sm font-medium">${hotel.city}, ${hotel.state}</p> <p class="text-xs mt-1 font-mono">${hotel.latitude.toFixed(4)}, ${hotel.longitude.toFixed(4)}</p> </div> </div>`} <!-- Reviews Placeholder --> <div class="reveal-up delay-300"> <h2 class="text-2xl font-bold mb-4">Reseñas de Huéspedes</h2> <div class="bg-base-200 rounded-2xl p-8 text-center border border-base-300"> <p class="text-4xl mb-3">⭐</p> <p class="font-semibold text-base-content/70">Las reseñas estarán disponibles próximamente</p> <p class="text-sm text-base-content/50 mt-1">¡Sé el primero en dejar una reseña!</p> </div> </div> </div> <!-- Sidebar Booking Card --> <div class="lg:col-span-1"> <div class="sticky top-20 space-y-4"> <div class="card bg-base-100 shadow-lg border border-base-200 reveal-right"> <div class="card-body p-6"> <!-- Price --> <div class="mb-4"> <p class="text-xs text-base-content/50 uppercase tracking-wide mb-1">Precio por noche desde</p> <p class="text-4xl font-bold price-gradient">
$${hotel.price_per_night.toLocaleString("es-MX")} <span class="text-base font-normal text-base-content/50 ml-1">MXN</span> </p> <p class="text-xs text-base-content/50 mt-1">+ impuestos (IVA 16%)</p> </div> <div class="divider my-3"></div> <!-- Booking Form --> ${renderComponent($$result2, "BookingForm", BookingForm, { "client:load": true, "itemType": "hotel", "itemName": hotel.name, "itemPrice": hotel.price_per_night, "itemSlug": hotel.slug, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/booking-frontend/src/components/BookingForm", "client:component-export": "default" })} <div class="divider my-3"></div> <!-- Contact Options --> <div class="space-y-2"> <a href="tel:+529981234567" class="btn btn-outline btn-block btn-sm gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path> </svg>
Llamar ahora
</a> <a href="/contact" class="btn btn-ghost btn-block btn-sm text-base-content/70">
¿Tienes dudas? Contáctanos
</a> </div> </div> </div> <!-- Cancellation Info --> <div class="card bg-success/8 border border-success/20 reveal-right delay-100"> <div class="card-body p-4"> <div class="flex items-start gap-3"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> <div> <p class="font-bold text-sm">Cancelación Gratuita</p> <p class="text-xs text-base-content/65 mt-1">
Cancela hasta 48 horas antes del check-in para un reembolso completo.
</p> </div> </div> </div> </div> </div> </div> </div> </div>  <section class="bg-base-200 py-14 mt-8"> <div class="container mx-auto px-4 text-center"> <h2 class="text-2xl font-bold mb-2">¿No es lo que buscas?</h2> <p class="text-base-content/60 mb-6">Explora más opciones de alojamiento en ${hotel.city}</p> <a href="/hotels" class="btn btn-primary btn-lg">
Ver todos los hoteles
</a> </div> </section> ` })}`;
}, "C:/laragon/www/booking-frontend/src/pages/hotels/[slug].astro", void 0);

const $$file = "C:/laragon/www/booking-frontend/src/pages/hotels/[slug].astro";
const $$url = "/hotels/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
