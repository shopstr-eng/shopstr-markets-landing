# Static content and navigation

Visitors read and navigate every public document before JavaScript runs.

## Sub-features

Seven public paths; canonical privacy alias; product/contact anchors; native FAQ and policy disclosures.

## How to get to it (user POV)

Open /, /faq, /about, /contact, /privacy, /privacy-policy or /terms-of-service directly. Use footer links and product links.

## Driving it with the browser helper

Preconditions: locked dependencies, Chromium and a successful production build.

Run `npm run verify:browser -- --output-dir /private/tmp/shopstr-content-proof`. The no-JavaScript journey checks one main/h1, body text, all details controls and a real internal document navigation. It verifies product, email and telephone hrefs without visiting external destinations.

## Gotchas

A collapsed details panel is usable because summary is native. Hidden CSS-only panels do not satisfy this journey. Static-host hidden-directory behavior still requires published verification.
