import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_DZkDxqiE.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/bookings.astro.mjs');
const _page3 = () => import('./pages/checkout.astro.mjs');
const _page4 = () => import('./pages/contact.astro.mjs');
const _page5 = () => import('./pages/hotels/_slug_.astro.mjs');
const _page6 = () => import('./pages/hotels.astro.mjs');
const _page7 = () => import('./pages/privacy.astro.mjs');
const _page8 = () => import('./pages/sitemap.xml.astro.mjs');
const _page9 = () => import('./pages/terms.astro.mjs');
const _page10 = () => import('./pages/tours/_slug_.astro.mjs');
const _page11 = () => import('./pages/tours.astro.mjs');
const _page12 = () => import('./pages/transfers/_slug_.astro.mjs');
const _page13 = () => import('./pages/transfers.astro.mjs');
const _page14 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.18.0_@netlify+blobs_f295334390c126270fa7e8a9ac1d1e57/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/bookings.astro", _page2],
    ["src/pages/checkout.astro", _page3],
    ["src/pages/contact.astro", _page4],
    ["src/pages/hotels/[slug].astro", _page5],
    ["src/pages/hotels/index.astro", _page6],
    ["src/pages/privacy.astro", _page7],
    ["src/pages/sitemap.xml.ts", _page8],
    ["src/pages/terms.astro", _page9],
    ["src/pages/tours/[slug].astro", _page10],
    ["src/pages/tours/index.astro", _page11],
    ["src/pages/transfers/[slug].astro", _page12],
    ["src/pages/transfers/index.astro", _page13],
    ["src/pages/index.astro", _page14]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "2295de5a-b446-4001-86a5-685e51ccf88d"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
