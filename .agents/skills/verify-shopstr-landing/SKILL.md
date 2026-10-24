---
name: verify-shopstr-landing
description: Verify Shopstr Markets static rendering, hydration, native navigation, route isolation and HTTP responses in a real Chromium browser.
---

# Verify Shopstr Markets

## Launch

Run `npm ci`, `npm run check`, and `npm test` from the repository root. The latter builds the public export and runs output and HTTP tests. Install Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an existing Chromium executable.

Run `npm run verify:browser -- --output-dir /private/tmp/shopstr-verification-proof`. The helper starts the real static app on an ephemeral loopback port and opens isolated contexts. A successful doctor result plus visible main heading establish readiness. The helper never needs .env, a database or external credentials. Use `--help` for supported options.

## Doctor

For an already owned instance run `npm run verify:browser -- --doctor http://127.0.0.1:5000/`. This only reads the URL and checks a successful Shopstr document containing main content. It does not create a server, browser or files. Confirm the PID and port belong to this run before driving any manually launched instance.

## Drive

Read features/README.md. Run the helper to exercise all mapped production journeys. It checks every public route with JavaScript disabled and enabled, opens native disclosures, follows document links, tests mobile menu interaction, checks selected-route script requests and verifies hydration preserves an existing main node. It also checks host-normalized URL aliases and proves that caught startup errors and aborted images are rejected by the verifier. A failing journey produces a nonzero exit and results.json with the failure.

For a preserved baseline export add `--baseline-dir /private/tmp/shopstr-prerender-baseline/public --samples 5`. Comparison alternates fresh baseline/candidate contexts with the same 150ms latency, 1.6Mbps download and 4x CPU throttle. It records successful decoded JavaScript bytes and LCP/long-task observations. These are local diagnostic measurements, not live-site timings or Lighthouse TBT.

Development verification uses `npm run dev`. Check each direct path and make one reversible text edit to confirm HMR. Restore that exact edit. Production browser checks do not prove development HMR.

## Evidence

Keep results.json, accessibility snapshots and desktop/mobile PNGs in the chosen output directory. Output must be outside both the repository and publicDir, including symlink destinations. Invalid paths fail before files or runtimes are created. External origins are deliberately blocked, so product/contact links are checked by destination without visiting or sending messages. Screenshot and node-identity checks distinguish hydration from a client remount. HTTP tests cover Markdown negotiation, CORS, aliases, missing resources and Nostr data.

## Cleanup

The helper closes only its own browser and ephemeral servers in finally and preserves all evidence. Manually launched dev instances must be stopped by their recorded PID or terminal session. Never kill by process name. Check results.json and screenshots still exist after cleanup. Do not remove evidence during teardown.

## Helpers

`scripts/verify-browser.mjs` is executable and runs through `npm run verify:browser`. It supports help, output/public directory selection, baseline comparison, sample count and read-only doctor. No dry-run mode is provided. The helper writes only evidence and launches read-only static serving; it does not publish or alter site data.
