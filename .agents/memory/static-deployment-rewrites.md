---
name: Static hosting requirement
description: Explicit rejection of Autoscale and deployment-specific constraints local tests cannot establish
---

The user explicitly rejected Autoscale and required static deployment after requesting a lightweight Node server. Keep publishing static unless they explicitly authorize a different deployment type.

**Why:** Interpreting the request for Node functionality as approval to switch hosting was incorrect. Hosting type is a separate product decision.

**How to apply:** Keep HTML and explicit Markdown exports available on static hosting. Do not claim that optional Node code executes there or satisfies same-URL negotiation. Explain incompatible requirements without silently switching hosting. Preserve genuine HTTP 404s rather than adding a catch-all SPA fallback.

Verify published dot-directory resources separately from build output and local static-server tests.

**Why:** A public Nostr verification URL returned 404 even though the build included the file. Replit documentation says static hosting generally does not serve hidden directories. Local Express serving with dotfiles enabled does not reproduce that restriction.

**How to apply:** Check the live endpoint after publishing before claiming Nostr verification works. A hosting rewrite or serving-layer change may be required; direct .replit rewrites were previously blocked and deployConfig did not expose them. Consult current tools/docs rather than assuming that restriction is permanent.
