import 'piccolore';
import { n as NOOP_MIDDLEWARE_HEADER, o as decodeKey } from './chunks/astro/server_ir7vVYZ-.mjs';
import 'clsx';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/laragon/www/booking-frontend/","cacheDir":"file:///C:/laragon/www/booking-frontend/node_modules/.astro/","outDir":"file:///C:/laragon/www/booking-frontend/dist/","srcDir":"file:///C:/laragon/www/booking-frontend/src/","publicDir":"file:///C:/laragon/www/booking-frontend/public/","buildClientDir":"file:///C:/laragon/www/booking-frontend/dist/","buildServerDir":"file:///C:/laragon/www/booking-frontend/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"bookings/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/bookings","isIndex":false,"type":"page","pattern":"^\\/bookings\\/?$","segments":[[{"content":"bookings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/bookings.astro","pathname":"/bookings","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"checkout/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/checkout","isIndex":false,"type":"page","pattern":"^\\/checkout\\/?$","segments":[[{"content":"checkout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/checkout.astro","pathname":"/checkout","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"hotels/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/hotels","isIndex":true,"type":"page","pattern":"^\\/hotels\\/?$","segments":[[{"content":"hotels","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/hotels/index.astro","pathname":"/hotels","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"privacy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"sitemap.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sitemap.xml","isIndex":false,"type":"endpoint","pattern":"^\\/sitemap\\.xml\\/?$","segments":[[{"content":"sitemap.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sitemap.xml.ts","pathname":"/sitemap.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"terms/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/terms","isIndex":false,"type":"page","pattern":"^\\/terms\\/?$","segments":[[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/terms.astro","pathname":"/terms","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"tours/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tours","isIndex":true,"type":"page","pattern":"^\\/tours\\/?$","segments":[[{"content":"tours","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tours/index.astro","pathname":"/tours","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"transfers/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/transfers","isIndex":true,"type":"page","pattern":"^\\/transfers\\/?$","segments":[[{"content":"transfers","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/transfers/index.astro","pathname":"/transfers","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@5.18.0_@netlify+blobs_f295334390c126270fa7e8a9ac1d1e57/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.7Hf2UekE.css"}],"routeData":{"route":"/hotels/[slug]","isIndex":false,"type":"page","pattern":"^\\/hotels\\/([^/]+?)\\/?$","segments":[[{"content":"hotels","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/hotels/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.7Hf2UekE.css"}],"routeData":{"route":"/tours/[slug]","isIndex":false,"type":"page","pattern":"^\\/tours\\/([^/]+?)\\/?$","segments":[[{"content":"tours","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/tours/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.7Hf2UekE.css"}],"routeData":{"route":"/transfers/[slug]","isIndex":false,"type":"page","pattern":"^\\/transfers\\/([^/]+?)\\/?$","segments":[[{"content":"transfers","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/transfers/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/laragon/www/booking-frontend/src/pages/about.astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/bookings.astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/checkout.astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/hotels/[slug].astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/hotels/index.astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/terms.astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/tours/[slug].astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/tours/index.astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/transfers/[slug].astro",{"propagation":"none","containsHead":true}],["C:/laragon/www/booking-frontend/src/pages/transfers/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/.pnpm/astro@5.18.0_@netlify+blobs_f295334390c126270fa7e8a9ac1d1e57/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/bookings@_@astro":"pages/bookings.astro.mjs","\u0000@astro-page:src/pages/checkout@_@astro":"pages/checkout.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/hotels/[slug]@_@astro":"pages/hotels/_slug_.astro.mjs","\u0000@astro-page:src/pages/hotels/index@_@astro":"pages/hotels.astro.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"pages/privacy.astro.mjs","\u0000@astro-page:src/pages/sitemap.xml@_@ts":"pages/sitemap.xml.astro.mjs","\u0000@astro-page:src/pages/terms@_@astro":"pages/terms.astro.mjs","\u0000@astro-page:src/pages/tours/[slug]@_@astro":"pages/tours/_slug_.astro.mjs","\u0000@astro-page:src/pages/tours/index@_@astro":"pages/tours.astro.mjs","\u0000@astro-page:src/pages/transfers/[slug]@_@astro":"pages/transfers/_slug_.astro.mjs","\u0000@astro-page:src/pages/transfers/index@_@astro":"pages/transfers.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DZkDxqiE.mjs","C:/laragon/www/booking-frontend/node_modules/.pnpm/unstorage@1.17.4_@netlify+blobs@10.7.0/node_modules/unstorage/drivers/netlify-blobs.mjs":"chunks/netlify-blobs_CPo6-Rdw.mjs","C:/laragon/www/booking-frontend/src/components/BookingForm":"_astro/BookingForm.DerBbXF9.js","C:/laragon/www/booking-frontend/src/components/HotelList":"_astro/HotelList.Cten9tP5.js","C:/laragon/www/booking-frontend/src/components/CheckoutPage":"_astro/CheckoutPage.lbUzZv95.js","@astrojs/react/client.js":"_astro/client.Dc9Vh3na.js","C:/laragon/www/booking-frontend/src/pages/bookings.astro?astro&type=script&index=0&lang.ts":"_astro/bookings.astro_astro_type_script_index_0_lang.Crfdv7Xe.js","C:/laragon/www/booking-frontend/src/pages/contact.astro?astro&type=script&index=0&lang.ts":"_astro/contact.astro_astro_type_script_index_0_lang.CBeWspsg.js","C:/laragon/www/booking-frontend/src/pages/tours/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.CDuEfIfh.js","C:/laragon/www/booking-frontend/src/pages/transfers/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.DsCyexJ4.js","C:/laragon/www/booking-frontend/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.Mv1gSU4f.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/laragon/www/booking-frontend/src/pages/bookings.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"lookup-form\"),n=document.getElementById(\"booking-result\");t?.addEventListener(\"submit\",e=>{e.preventDefault(),n?.classList.remove(\"hidden\")});"],["C:/laragon/www/booking-frontend/src/pages/contact.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"contact-form\"),e=document.getElementById(\"contact-submit\"),n=document.getElementById(\"contact-success\");t?.addEventListener(\"submit\",async s=>{if(s.preventDefault(),!t.checkValidity()){t.reportValidity();return}e.textContent=\"Enviando...\",e.disabled=!0,await new Promise(c=>setTimeout(c,1500)),t.reset(),e.textContent=\"Enviar mensaje\",e.disabled=!1,n?.classList.remove(\"hidden\"),setTimeout(()=>n?.classList.add(\"hidden\"),5e3)});"],["C:/laragon/www/booking-frontend/src/pages/tours/index.astro?astro&type=script&index=0&lang.ts","const l=document.getElementById(\"tour-search\"),m=document.getElementById(\"tour-destination\"),f=document.getElementById(\"tour-difficulty\"),h=document.getElementById(\"tour-sort\"),d=document.getElementById(\"tours-grid\"),i=document.getElementById(\"tours-empty\"),u=document.getElementById(\"tour-count\");function s(){const c=l?.value.toLowerCase()||\"\",o=m?.value.toLowerCase()||\"\",r=f?.value||\"\",a=h?.value||\"featured\",g=Array.from(d?.querySelectorAll(\"article\")||[]);let t=[];g.forEach(e=>{const n=e.dataset.name||\"\",y=e.dataset.destination||\"\",p=e.dataset.difficulty||\"\",E=!c||n.includes(c),v=!o||y.includes(o);E&&v&&(!r||p===r)?(e.style.display=\"\",t.push(e)):e.style.display=\"none\"}),t.sort((e,n)=>a===\"price-asc\"?Number(e.dataset.price)-Number(n.dataset.price):a===\"price-desc\"?Number(n.dataset.price)-Number(e.dataset.price):Number(n.dataset.featured)-Number(e.dataset.featured)),t.forEach(e=>d?.appendChild(e)),u&&(u.textContent=String(t.length)),i&&i.classList.toggle(\"hidden\",t.length>0)}l?.addEventListener(\"input\",s);m?.addEventListener(\"change\",s);f?.addEventListener(\"change\",s);h?.addEventListener(\"change\",s);"],["C:/laragon/www/booking-frontend/src/pages/transfers/index.astro?astro&type=script&index=0&lang.ts","const f=document.getElementById(\"tf-from\"),p=document.getElementById(\"tf-to\"),g=document.getElementById(\"tf-vehicle\"),v=document.getElementById(\"tf-type\"),y=document.getElementById(\"tf-sort\"),l=document.getElementById(\"tf-grid\"),u=document.getElementById(\"tf-empty\"),m=document.getElementById(\"tf-count\");function c(){const o=f?.value.toLowerCase()||\"\",s=p?.value.toLowerCase()||\"\",r=g?.value.toLowerCase()||\"\",a=v?.value||\"\",d=y?.value||\"price-asc\",E=Array.from(l?.querySelectorAll(\"article\")||[]);let t=[];E.forEach(e=>{const n=e.dataset.from||\"\",h=e.dataset.to||\"\",I=e.dataset.vehicle||\"\",L=e.dataset.private||\"\",i=(!o||n.includes(o))&&(!s||h.includes(s))&&(!r||I===r)&&(!a||L===a);e.style.display=i?\"\":\"none\",i&&t.push(e)}),t.sort((e,n)=>d===\"price-asc\"?Number(e.dataset.price)-Number(n.dataset.price):d===\"price-desc\"?Number(n.dataset.price)-Number(e.dataset.price):Number(n.dataset.featured)-Number(e.dataset.featured)),t.forEach(e=>l?.appendChild(e)),m&&(m.textContent=String(t.length)),u&&u.classList.toggle(\"hidden\",t.length>0)}f?.addEventListener(\"input\",c);p?.addEventListener(\"input\",c);g?.addEventListener(\"change\",c);v?.addEventListener(\"change\",c);y?.addEventListener(\"change\",c);"],["C:/laragon/www/booking-frontend/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","const i=new IntersectionObserver(o=>{o.forEach(t=>{t.isIntersecting&&(t.target.classList.add(\"visible\"),i.unobserve(t.target))})},{threshold:.1,rootMargin:\"0px 0px -40px 0px\"});document.querySelectorAll(\".reveal-up, .reveal-left, .reveal-right, .reveal-scale\").forEach(o=>i.observe(o));const e=document.getElementById(\"main-navbar\");if(e){const o=e.classList.contains(\"transparent-nav\"),t=e.querySelectorAll(\".nav-text\"),r=e.querySelector(\".nav-logo-text\"),s=e.querySelector(\".nav-logo-accent\"),c=l=>{const a=l?\"#0f172a\":\"\",v=l?\"#0891b2\":\"\";t.forEach(g=>{g.style.color=a}),r&&(r.style.color=a),s&&(s.style.color=v)},n=()=>{const l=window.scrollY>60;e.classList.toggle(\"scrolled\",l),c(o?l:!0)};window.addEventListener(\"scroll\",n,{passive:!0}),n()}"]],"assets":["/_astro/about.7Hf2UekE.css","/favicon.ico","/favicon.svg","/robots.txt","/_astro/BookingForm.DerBbXF9.js","/_astro/CheckoutPage.lbUzZv95.js","/_astro/client.Dc9Vh3na.js","/_astro/HotelList.Cten9tP5.js","/_astro/index.DiEladB3.js","/_astro/jsx-runtime.D_zvdyIk.js","/about/index.html","/bookings/index.html","/checkout/index.html","/contact/index.html","/hotels/index.html","/privacy/index.html","/sitemap.xml","/terms/index.html","/tours/index.html","/transfers/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"/I3y1USJroN1hVwWpX5Gdf1NNbxxEkf4FMclOoGQ6mk=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_CPo6-Rdw.mjs');

export { manifest };
