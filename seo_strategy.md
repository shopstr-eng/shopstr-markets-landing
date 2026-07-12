# SEO Strategy

## In scope

- Public marketing homepage (`/`)
- Public FAQ page (`/faq`)
- Public legal pages (`/privacy-policy`, `/terms-of-service`)

## Out of scope

- API routes (`/api/**`)
- Authenticated or admin surfaces (none identified in this repo)
- 404 page (`/not-found`) except where it affects sitewide crawl behavior

## Target audience

- Buyers and sellers interested in permissionless marketplaces
- People searching for Bitcoin, Nostr, and private peer-to-peer commerce tools

## Primary keywords

- shopstr markets
- permissionless marketplace
- bitcoin marketplace
- nostr marketplace
- peer-to-peer commerce

## Rendering model

- Public site is a Vite + React SPA with client-side routing via Wouter
- Production deployment is static and copies the same `index.html` into `/faq`, `/privacy-policy`, and `/terms-of-service`
- Public content is therefore JavaScript-rendered after the initial HTML response

## Dismissed categories

- (None yet)
