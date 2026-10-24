# Prerendering verification

The application is implemented in e86f133 on perf/prerender-hydrate-routes, based on e517c3a. Origin main and upstream main were both confirmed at e517c3a after implementation.

## Checks

- npm run check passes.
- npm test builds the browser and SSR targets and passes 196 tests with no failures. The upstream baseline passed 164 tests.
- All seven public routes pass actual Chromium journeys with JavaScript disabled and enabled. Existing SSR main nodes retain identity after hydration.
- Five browser alias journeys pass hydration and refresh: /faq/, /faq/index.html, /privacy/index.html, /%66aq, and /faq/?from=verification.
- Native disclosures preserve a change made while JavaScript is blocked. A deliberately failed FAQ page-module download leaves content and native disclosures usable.
- No unrelated page chunks are requested. No unexpected page errors, hydration errors, HTTP failures or network failures occur in successful journeys and measurement samples.
- Development mounts the empty shell, updates real FAQ text through HMR without a document reload, and restores the original text.
- Existing tests retain metadata, Markdown, schema, contact data, aliases, 404s, CORS, content negotiation and public-resource contracts.

## Local cold-load comparison

Five alternating samples per build use fresh Chromium contexts, disabled cache, 150ms simulated latency, 1.6Mbps download, 750Kbps upload and 4x CPU slowdown. Both are production exports served by the same static-app implementation. External origins are blocked in both. JavaScript bytes are successful decoded response-body bytes, not compressed production transfer sizes.

| Observation                 | Upstream baseline median and range | New build median and range        |
| --------------------------- | ---------------------------------- | --------------------------------- |
| Homepage JavaScript         | 518,771 bytes, 518,771 to 518,771  | 394,254 bytes, 394,254 to 394,254 |
| Largest contentful paint    | 8,280 ms, 8,276 to 8,288           | 6,400 ms, 6,396 to 6,444          |
| Observed long-task blocking | 5 ms, 4 to 10                      | 0 ms, 0 to 0                      |

The homepage loads 24.0% fewer JavaScript body bytes. Local throttled LCP falls by 22.7%. These timings describe this diagnostic setup, not the deployed site. Observed long-task blocking is not Lighthouse TBT.

The limiting path in this setup is network delivery of the unchanged rocket image. Resource timing attributes LCP to the same 164,686-byte WebP in both builds. In the first baseline sample its request starts after the JavaScript-rendered page arrives; prerendering exposes it to the browser during HTML parsing. This removes the JavaScript dependency from image discovery. The exact resource timings and all ten samples are retained in the raw proof. CPU blocking is small, so this is not evidence of a major CPU-throughput improvement.

## Evidence and reproduction

Run these commands from the repository root:

```sh
npm ci
npm run check
npm test
npx playwright install chromium
npm run verify:browser -- --output-dir /private/tmp/shopstr-new-proof
```

For the same before/after comparison, preserve dist/public from e517c3a, then add --baseline-dir pointing to that copy and --samples 5. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH when using an existing Chromium. The generated verification skill documents launch, doctor, native journeys, HMR and cleanup.

Evidence retained on the implementation computer:

- /private/tmp/shopstr-prerender-release-proof/results.json contains route, alias, failure-path and ten-sample results with resource timings.
- /private/tmp/shopstr-prerender-release-proof contains desktop/mobile screenshots and accessibility snapshots.
- /private/tmp/shopstr-dev-proof/results.json and server.log record development/HMR verification.
- /private/tmp/shopstr-prerender-test.log and shopstr-prerender-check.log record the final application checks.

## Review and limits

Independent review found no blocking application issue. Its benchmark HTTP-error and alias-browser coverage findings were fixed and executed. A minor median calculation issue for optional even sample counts was corrected; the recorded five-sample result is unaffected. The review used independent agents from the same configured model family.

Static publishing configuration is unchanged. No deployment or feature merge occurred. Published hidden-directory handling, CDN compression, HTTP/2 behavior and real-user timings remain outside local verification. Native page navigation intentionally requests each destination document.
