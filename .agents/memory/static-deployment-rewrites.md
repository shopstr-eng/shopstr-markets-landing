---
name: Static deployment SPA rewrites
description: How SPA route fallbacks were solved for static deployment when .replit rewrites cannot be edited by the agent
---

The agent cannot edit `.replit` at all (edit tool and bash appends are both blocked), and `deployConfig` silently ignores a `rewrites` parameter. So `[[deployment.rewrites]]` (the proper SPA catch-all `from = "/*"` / `to = "/index.html"`) can only be added manually by the user.

**Why:** Static deployments serve files directly; wouter client routes like /faq 404 on direct visits without a fallback.

**How to apply:** The deployment build command works around it by copying `dist/public/index.html` into `faq/`, `privacy-policy/`, and `terms-of-service/` directories after `vite build`. If a new top-level route is added to `client/src/App.tsx`, the copy list in the `.replit` deployment build command must be updated too (ask the user to update it, or reconfigure via deployConfig's build param). Unknown deep links return a server 404 instead of the SPA NotFound page unless the user adds the rewrite manually.
