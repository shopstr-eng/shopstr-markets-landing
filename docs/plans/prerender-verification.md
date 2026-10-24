# Prerendering verification

The initial application was implemented in e86f133 and its reviewed application fixes are in c0107f3 on perf/prerender-hydrate-routes, based on e517c3a. Origin main and upstream main were both confirmed at e517c3a after implementation.

## Checks

- npm run check passes.
- npm test builds the browser and SSR targets and passes 204 tests with no failures. The upstream baseline passed 164 tests.
- All seven public routes pass actual Chromium journeys with JavaScript disabled and enabled. Existing SSR main nodes retain identity after hydration.
- Nine browser alias journeys pass hydration and refresh, including trailing slashes, index.html, encoded characters, query strings, duplicate separators and encoded separators.
- Native disclosures preserve a change made while JavaScript is blocked. A deliberately failed FAQ page-module download leaves content and native disclosures usable.
- No unrelated page chunks are requested. Deliberate caught-startup and aborted-image faults are rejected, and evidence-directory tests cover direct, existing-symlink, dangling-symlink and repository paths. No unexpected page errors, hydration errors, HTTP failures or network failures occur in successful journeys and measurement samples.
- Development mounts the empty shell, updates real FAQ text through HMR without a document reload, and restores the original text.
- Existing tests retain metadata, Markdown, schema, contact data, aliases, 404s, CORS, content negotiation and public-resource contracts.

- Additional real-input journeys pass with desktop JavaScript disabled and mobile JavaScript enabled: section navigation, all three product links, footer-to-FAQ navigation, and native disclosure activation. Outbound document requests are intercepted before external network access.

## Local cold-load comparison

Five alternating samples per build use fresh 1440x900 Chromium contexts, disabled cache, 150ms simulated latency, 1.6Mbps download, 750Kbps upload and 4x CPU slowdown. Both are production exports served by the same static-app implementation. External origins are blocked in both. JavaScript bytes are successful decoded response-body bytes, not compressed production transfer sizes.

| Observation                     | Upstream baseline median and range | PR median and range               |
| ------------------------------- | ---------------------------------- | --------------------------------- |
| Homepage JavaScript             | 518,771 bytes, 518,771 to 518,771  | 394,461 bytes, 394,461 to 394,461 |
| Largest contentful paint        | 8,276 ms, 8,256 to 8,280           | 6,400 ms, 6,380 to 6,420          |
| Observed long-task blocking     | 4 ms, 2 to 10                      | 0 ms, 0 to 0                      |
| Homepage HTML                   | 22,434 bytes                       | 58,566 bytes                      |
| HTML + CSS + initial JavaScript | 757,753 bytes                      | 669,981 bytes                     |

The homepage loads 23.96% fewer JavaScript body bytes, a reduction of 124,310 bytes. Local throttled LCP falls by 22.67%, a reduction of 1,876ms. These timings describe this diagnostic setup, not the deployed site. Observed long-task blocking is not Lighthouse TBT.

Homepage HTML grows by 36,132 bytes because it contains the real React markup. The HTML, CSS and initially requested JavaScript bodies together shrink by 87,772 bytes, or 11.58%. These totals exclude images, request headers and deployment compression. The rocket image remains 164,686 bytes.

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

- /private/tmp/shopstr-upstream-pr-e2e/results.json contains route, alias, failure-path and ten-sample results with resource timings.
- /private/tmp/shopstr-upstream-pr-e2e contains desktop/mobile screenshots and accessibility snapshots.
- /private/tmp/shopstr-upstream-pr-dev-proof/results.json and server.log record development/HMR verification.
- /private/tmp/shopstr-upstream-pr-tests.log and shopstr-upstream-pr-check.log record the final application checks.

- /private/tmp/shopstr-upstream-navigation-e2e-complete/results.json records real link activation with external navigation blocked.

## Review and limits

The subsequent [deep review](prerender-deep-review.md) found and fixed hydration, Markdown and verifier defects. Independent fix review found no remaining blocking issue. Its benchmark HTTP-error and alias-browser coverage findings were fixed and executed. A minor median calculation issue for optional even sample counts was corrected; the recorded five-sample result is unaffected. The review used independent agents from the same configured model family.

Static publishing configuration is unchanged. No deployment or feature merge occurred. Published hidden-directory handling, CDN compression, HTTP/2 behavior and real-user timings remain outside local verification. Native page navigation intentionally requests each destination document.
