# HTTP responses and development

Direct URLs preserve status, representations and live development updates.

## Sub-features

Alias/direct refresh; 404 resources; Markdown/CORS; development empty root and HMR.

## How to get to it (user POV)

Enter a direct page, a known index.html alias, /missing-page, /assets/missing-file.js or an explicit index.md link.

## Driving it with the browser helper

Preconditions: locked dependencies, Chromium and a successful production build.

Run `npm test` for the full output/HTTP suite and `npm run verify:browser` for direct aliases and 404s. Run `npm run dev` in an owned terminal, read its readiness log, open /faq directly, edit one visible text string, observe HMR, restore the original file, and stop that terminal. Doctor an owned instance with `npm run verify:browser -- --doctor http://127.0.0.1:5000/`.

## Gotchas

Do not publish or change static deployment configuration. The optional Node server can negotiate Markdown; static hosting serves explicit index.md files. Local tests do not establish deployment-specific rewrites.
