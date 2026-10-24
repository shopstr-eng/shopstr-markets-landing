# Upstream PR end-to-end results

Target repository: https://github.com/shopstr-eng/shopstr-markets-landing, base main at e517c3a. The implementation branch is perf/prerender-hydrate-routes on GautamBytes's fork. A PR accidentally opened inside that fork is superseded by the upstream proposal.

## Exact improvements

- Homepage JavaScript response bodies: 518,771 to 394,461 bytes. This saves 124,310 bytes, or 23.96%.
- Local throttled median LCP: 8,276 to 6,400ms. This saves 1,876ms, or 22.67%.
- The homepage HTML, CSS and initially requested JavaScript together total 757,753 to 669,981 uncompressed body bytes. This saves 87,772 bytes, or 11.58%.
- HTML alone increases from 22,434 to 58,566 bytes. That is the explicit cost of sending the full canonical React page before JavaScript.
- The hero image is unchanged at 164,686 bytes. The performance work is earlier image discovery, smaller initial JavaScript and matching hydration, not image compression.

The baseline already exported separate fallback HTML. This PR replaces that duplicate content with actual React render output, hydrates its existing DOM, and loads only the requested page module. Native links and disclosures preserve no-JavaScript usability in that same canonical markup. Metadata, Markdown, aliases and static hosting remain covered.

## Fresh testing before upstream creation

- npm run check passes.
- npm test builds both targets and passes 204 tests with zero failures and zero skips.
- Chromium passes seven public routes with and without JavaScript, nine browser aliases and refreshes, preserved SSR nodes, all native disclosures, early interaction, failed selected-module preservation and two deliberate verifier rejection fixtures.
- Additional browser input journeys pass section links, all three product links and FAQ navigation with desktop JavaScript disabled and mobile JavaScript enabled. Outbound destinations are captured and blocked before networking. External marketplaces are not tested.
- Development mounts its empty shell and HMR updates visible FAQ text without a document reload, then restores the exact original source.
- Five alternating cold samples per build use fresh 1440x900 contexts, disabled cache, 150ms latency, 1.6Mbps download, 750Kbps upload and 4x CPU throttling. All samples reject console, page, HTTP and network failures and require actual initialization.

## Evidence

- /private/tmp/shopstr-upstream-pr-e2e/results.json contains the browser checks, ten measurement samples and resource timings.
- /private/tmp/shopstr-upstream-navigation-e2e-complete/results.json contains the real-input navigation checks.
- /private/tmp/shopstr-upstream-pr-dev-proof/results.json contains development/HMR proof.
- /private/tmp/shopstr-upstream-pr-tests.log and shopstr-upstream-pr-check.log contain the fresh build, tests and typecheck.

The extra no-JavaScript probe uses driver-side observations for native scroll completion. A page-side animation-frame poll and an externally blocked popup-load wait were unsuitable observation methods and were replaced. No application source changed during this test pass.

These are local production-build measurements. Published CDN/compression behavior and real-user timings are not established by this run.
