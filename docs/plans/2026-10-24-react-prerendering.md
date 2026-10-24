# React prerendering and route delivery

## Goal and baseline

Generate every public document from the React components that the browser hydrates. A visitor can read content, follow links, and expand FAQ and policy sections without JavaScript. Loading one page must not load unrelated page modules.

Branch perf/prerender-hydrate-routes starts at e517c3a after origin/main was fast-forwarded to upstream/main. The unchanged baseline passes type checking and all 164 tests. Current HTML uses separate templates and createRoot replaces it with an eagerly bundled application. Baseline exports and logs are saved at /private/tmp/shopstr-prerender-baseline.

## Global constraints

- Keep Replit deploymentTarget static and publicDir dist/public. Do not deploy or merge the feature branch.
- Preserve /, /faq, /about, /contact, /privacy, /privacy-policy, /terms-of-service and existing trailing-slash and index.html aliases.
- Preserve /privacy canonical /privacy-policy, route metadata, Organization schema, contact details, sitemap, robots, llms.txt, Markdown exports, Node content negotiation, Nostr JSON and CORS, and genuine 404s.
- Use React 18 renderToString and hydrateRoot with identical provider and component trees and identifier prefixes. Never use renderToStaticMarkup for hydrated content.
- Keep SSR output outside dist/public. Publish neither application source nor the SSR bundle.
- Load and preload only the selected page and its static dependencies, never every dynamic import.
- Use native document navigation and native details/summary. Preserve product copy and visual layout wherever practical.
- No unrelated framework migration, image optimization, security hardening, or hosting changes.

## Design and interfaces

client/src/routes.ts owns typed records for path, page key, canonical path, title, description, social title and social description. Its literal loader map maps page keys to explicit dynamic imports. Both privacy paths share a loader. resolveRoute(pathname) recognizes public paths and known aliases only. Unknown paths use a separate not-found loader and never become the homepage.

App accepts a loaded React page component and supplies the common provider tree. Keep NextUIProvider locale en-US. Remove unused query, toast and tooltip providers from the entry path because no pages consume them. Leave dormant component files alone.

entry-server.tsx exports routes and async renderRoute(pathname), which resolves the route, awaits its page module and returns React HTML and route metadata. Build it with Vite SSR into dist/prerender. The browser build emits dist/public/.vite/manifest.json. The exporter moves build metadata to dist/client-manifest.json and removes the empty public .vite directory before publishing. Browser verification reads this sibling manifest. Build metadata must not become a new public-file exception.

main.tsx resolves window.location.pathname, awaits that page module and hydrates existing React markup. An empty development root uses createRoot. A failed page import leaves server HTML usable and reports the error. Native anchors perform document navigation, so the next page obtains its generated HTML and metadata without a second routing state machine.

The exporter imports the built renderer and client manifest. Keep existing metadata/schema processing, replace NAV_HTML, FOOTER_HTML and PAGE_CONTENT copies with React output, and derive Markdown from that same output. Emit modulepreload for the selected page and recursive static imports and any selected-route CSS. Do not traverse dynamicImports. Fail for missing route modules, manifest entries or referenced assets. Await all renders before reporting success.

## Progressive enhancement

- Each actual page has one main containing its h1. Preserve the existing content assertions.
- Convert FAQ, privacy and terms to native details/summary. Content must be reachable before hydration, with matching initial HTML on server and client.
- Convert marketplace window.open buttons to anchors, keeping their destinations, styling and external-tab attributes.
- Replace remaining Wouter Links in pages and TrustPage with native anchors. Use native hash navigation and CSS smooth scrolling only when reduced motion is not requested.
- Render FAQ schema once from the same questions. Remove the effect that duplicates schema after hydration.

## Architecture decision

Candidate A uses explicit per-page browser entries and a separate SSR page map. Candidate B uses one dynamic bootstrap and registry. The independent judge selected B, 22/25 versus 19/25, for single route ownership and smaller maintenance burden. Hydration was unproven in both sketches. Graft A's safeguards: recursive static import checks, root-node identity during hydration, SSR output outside publicDir, asset validation and preserving HTML on failed imports.

We accept asynchronous module selection in return for one route registry. Route modulepreload avoids a discovery waterfall. Native document navigation avoids SPA loading states, navigation races, head updates and history synchronization. The installed NextUI basic Card passed renderToString feasibility. Real-page hydration remains a required gate.

## Execution checklist

- [x] Read poteto-mode Principles and ground current upstream using how.
- [x] Frame the falsifiable outcome and preserve a passing baseline.
- [x] Compare two architecture candidates and obtain an independent verdict.
- [x] Implement one coupled rendering change against these contracts.
- [x] Verify the actual production and development journeys independently.
- [x] Review spec compliance and maintainability, fix accepted findings, rerun affected checks.
- [x] Commit the spec, implementation and reproducible verification on the feature branch.

## Throughput checkpoint

- Blocking first steps. Sync main, preserve baseline, test NextUI SSR feasibility, write this spec and select the design before implementation.
- Independent workstreams. Architecture/review workers are read-only. One owner edits application/build/package/tests. Parent writes this spec and browser verification skill at disjoint paths.
- Shared mutable state. Serialize package/build changes. Every runtime owns a port, browser profile and evidence directory.
- Smallest safe decomposition. One owner handles registry, rendering, export, enhancement and output tests because asset mapping and hydration are coupled.

## Verification and acceptance

Run npm run check and npm test. Retain all content, metadata, schema, static HTTP, negotiation and Nostr tests. Replace only source-shape assertions requiring eager imports and Route JSX with output behavior and import-graph checks. Add tests for React HTML, selected-route static dependency graphs, assets, aliases and one FAQ schema.

Create .agents/skills/verify-shopstr-landing with launch/readiness, a read-only doctor check, real browser driving, evidence and cleanup. Its helper starts createStaticApp on an owned ephemeral port, supports help, evidence-output and Chromium-executable options, and closes only its own server/browser. Use the repository's locked Playwright development dependency. Keep proof outside publicDir and out of git.

Drive all seven public paths, trailing slash and index.html aliases, a missing page and missing asset. Without JavaScript, check main/h1, contact/product links, expand disclosures and follow an internal document link. With JavaScript, capture page/console/hydration errors, prove an existing SSR node retains identity, use disclosures and links, and inspect network requests for unrelated page modules. Save mobile and desktop screenshots. Verify the development empty shell and an actual HMR edit followed by restoration.

Compare baseline and changed production builds using at least five alternating cold contexts with the same network and CPU settings. Count actual successful JavaScript response bytes and requests. Distinguish decoded bytes from compressed transfer bytes and user-visible latency. Capture LCP/blocking time when observable and report median/range and errors. Call timing differences inconclusive when noise or unmodified imagery dominates. Do not claim a speedup from bundle size alone.

## Risks and limits

Verify React Aria IDs, native details state, Markdown conversion of React text/comment nodes, preload recursion and SSR asset URLs. Preserve the static hosting requirement and known hidden-directory limitations. Local tests do not verify published hosting. No publication is part of this task.
