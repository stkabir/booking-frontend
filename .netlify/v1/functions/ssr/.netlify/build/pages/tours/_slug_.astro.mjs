import { c as createComponent, i as renderComponent, r as renderTemplate, f as createAstro, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_ir7vVYZ-.mjs';
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
  let tour = null;
  try {
    tour = await api.getTour(slug);
  } catch {
    return Astro2.redirect("/tours");
  }
  if (!tour) return Astro2.redirect("/tours");
  const included = (() => {
    try {
      return tour.included ? JSON.parse(tour.included) : [];
    } catch {
      return tour.included || [];
    }
  })();
  const notIncluded = (() => {
    try {
      return tour.not_included ? JSON.parse(tour.not_included) : [];
    } catch {
      return tour.not_included || [];
    }
  })();
  const difficultyLabel = tour.difficulty_level === "easy" ? "F\xE1cil" : tour.difficulty_level === "moderate" ? "Moderado" : "Dif\xEDcil";
  const difficultyColor = tour.difficulty_level === "easy" ? "badge-success" : tour.difficulty_level === "moderate" ? "badge-warning" : "badge-error";
  const tourSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: tour.name,
    description: tour.description,
    touristType: ["Families", "Couples", "Solo Travelers"],
    geo: tour.latitude && tour.longitude ? {
      "@type": "GeoCoordinates",
      latitude: tour.latitude,
      longitude: tour.longitude
    } : void 0,
    address: {
      "@type": "PostalAddress",
      addressLocality: tour.destination,
      addressRegion: "Quintana Roo",
      addressCountry: "MX"
    },
    offers: {
      "@type": "Offer",
      price: tour.price_adult,
      priceCurrency: "MXN",
      availability: "https://schema.org/InStock",
      url: `https://bookingcaribe.com/tours/${tour.slug}`
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${tour.name} - Tour en ${tour.destination}`, "description": `Reserva el tour ${tour.name} en ${tour.destination}. Duraci\xF3n: ${tour.duration}. Desde $${tour.price_adult.toLocaleString("es-MX")} MXN por adulto. ${tour.description?.slice(0, 100) || ""}`, "keywords": `${tour.name}, tour ${tour.destination}, excursi\xF3n ${tour.destination}, ${tour.name} precio, tour ${tour.destination} reservar`, "schema": tourSchema }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="bg-base-200 py-3 border-b border-base-300"> <div class="container mx-auto px-4"> <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-base-content/60"> <a href="/" class="hover:text-primary transition-colors">Inicio</a> <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> <a href="/tours" class="hover:text-primary transition-colors">Tours</a> <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> <span class="text-base-content font-medium truncate max-w-[200px]">${tour.name}</span> </nav> </div> </div> <div class="container mx-auto px-4 py-10"> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"> <!-- Main Content --> <div class="lg:col-span-2 space-y-8"> <!-- Header --> <div class="reveal-up"> <div class="flex flex-wrap gap-2 mb-3"> ${tour.featured && renderTemplate`<span class="badge badge-secondary">Tour Destacado</span>`} <span${addAttribute(`badge ${difficultyColor}`, "class")}>${difficultyLabel}</span> </div> <h1 class="text-3xl md:text-4xl font-bold leading-tight mb-4">${tour.name}</h1> <!-- Quick Info Pills --> <div class="grid grid-cols-2 md:grid-cols-4 gap-3"> ${[
    { icon: "\u23F1\uFE0F", label: "Duraci\xF3n", value: tour.duration },
    { icon: "\u{1F465}", label: "Grupo m\xE1x.", value: `${tour.max_people} personas` },
    { icon: "\u{1F4CD}", label: "Destino", value: tour.destination },
    { icon: "\u{1F5FA}\uFE0F", label: "Punto de encuentro", value: tour.meeting_point || "Por confirmar" }
  ].map(({ icon, label, value }) => renderTemplate`<div class="bg-base-200 rounded-xl p-3 text-center"> <span class="text-lg" aria-hidden="true">${icon}</span> <p class="text-xs text-base-content/50 mt-1">${label}</p> <p class="text-sm font-semibold mt-0.5 line-clamp-1">${value}</p> </div>`)} </div> </div> <!-- Image --> <div class="reveal-up delay-100 h-72 md:h-96 rounded-2xl overflow-hidden relative"> <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600"></div> <div class="absolute inset-0 flex flex-col items-center justify-center text-white/25"> <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> <p class="mt-3 text-sm font-medium">Fotos del tour próximamente</p> </div> <div class="absolute top-6 right-6 w-24 h-24 rounded-full bg-white/8 blur-2xl"></div> </div> <!-- Description --> <div class="reveal-up delay-100"> <h2 class="text-2xl font-bold mb-4">Sobre este tour</h2> <p class="text-base-content/70 leading-relaxed">${tour.description}</p> ${tour.highlights && renderTemplate`<div class="mt-4 p-5 bg-primary/6 rounded-2xl border border-primary/15"> <h3 class="font-bold text-primary mb-2">✨ Highlights</h3> <p class="text-sm text-base-content/70 leading-relaxed">${tour.highlights}</p> </div>`} </div> <!-- Included / Not Included --> <div class="reveal-up delay-200 grid md:grid-cols-2 gap-6"> <div> <h3 class="text-xl font-bold mb-4 flex items-center gap-2"> <span class="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path> </svg> </span>
Incluye
</h3> ${included.length > 0 ? renderTemplate`<ul class="space-y-2"> ${included.map((item) => renderTemplate`<li class="flex items-start gap-2.5 text-sm"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path> </svg> <span class="text-base-content/75">${item}</span> </li>`)} </ul>` : renderTemplate`<p class="text-sm text-base-content/50">Consultar con el operador</p>`} </div> <div> <h3 class="text-xl font-bold mb-4 flex items-center gap-2"> <span class="w-6 h-6 rounded-full bg-error/12 flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path> </svg> </span>
No incluye
</h3> ${notIncluded.length > 0 ? renderTemplate`<ul class="space-y-2"> ${notIncluded.map((item) => renderTemplate`<li class="flex items-start gap-2.5 text-sm"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path> </svg> <span class="text-base-content/75">${item}</span> </li>`)} </ul>` : renderTemplate`<p class="text-sm text-base-content/50">No especificado</p>`} </div> </div> <!-- Important Info --> <div class="reveal-up delay-300 alert bg-info/8 border border-info/20 rounded-2xl"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-info shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <div> <p class="font-bold text-sm">Información importante</p> <ul class="text-sm text-base-content/65 mt-1.5 space-y-1"> <li>• Llega 15 minutos antes de la hora de salida</li> <li>• Usa ropa cómoda y protector solar</li> <li>• Cancelación gratuita hasta 24h antes</li> </ul> </div> </div> </div> <!-- Sidebar Booking Card --> <div class="lg:col-span-1"> <div class="sticky top-20 space-y-4"> <div class="card bg-base-100 shadow-lg border border-base-200 reveal-right"> <div class="card-body p-6"> <div class="mb-4"> <p class="text-xs text-base-content/50 uppercase tracking-wide mb-1">Precio por adulto desde</p> <p class="text-4xl font-bold price-gradient">
$${tour.price_adult.toLocaleString("es-MX")} <span class="text-base font-normal text-base-content/50 ml-1">MXN</span> </p> ${tour.price_child && renderTemplate`<p class="text-xs text-base-content/55 mt-1">
Niños: $${tour.price_child.toLocaleString("es-MX")} MXN
</p>`} </div> <div class="divider my-3"></div> ${renderComponent($$result2, "BookingForm", BookingForm, { "client:load": true, "itemType": "tour", "itemName": tour.name, "itemPrice": tour.price_adult, "itemSlug": tour.slug, "childPrice": tour.price_child || void 0, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/booking-frontend/src/components/BookingForm", "client:component-export": "default" })} <div class="divider my-3"></div> <a href="https://wa.me/529981234567?text=Hola,%20me%20interesa%20el%20tour%20\${encodeURIComponent(tour.name)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm bg-green-500 hover:bg-green-600 border-0 text-white w-full gap-2"> <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"></path> </svg>
Consultar por WhatsApp
</a> </div> </div> <!-- Cancellation Policy --> <div class="card bg-success/8 border border-success/20 reveal-right delay-100"> <div class="card-body p-4"> <div class="flex items-start gap-3"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> <div> <p class="font-bold text-sm">Cancelación Gratuita</p> <p class="text-xs text-base-content/65 mt-1">
Cancela hasta 24 horas antes sin ningún cargo.
</p> </div> </div> </div> </div> </div> </div> </div> </div>  <section class="bg-base-200 py-14 mt-8"> <div class="container mx-auto px-4 text-center"> <h2 class="text-2xl font-bold mb-2">Más tours en ${tour.destination}</h2> <p class="text-base-content/60 mb-6">Descubre otras experiencias únicas en el Caribe Mexicano</p> <a href="/tours" class="btn btn-primary btn-lg">
Ver todos los tours
</a> </div> </section> ` })}`;
}, "C:/laragon/www/booking-frontend/src/pages/tours/[slug].astro", void 0);

const $$file = "C:/laragon/www/booking-frontend/src/pages/tours/[slug].astro";
const $$url = "/tours/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
