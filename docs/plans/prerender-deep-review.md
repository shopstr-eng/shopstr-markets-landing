# Deep review of prerendering changes

## Scope

Review the full e517c3a...cb0d920 branch diff, not just the last commit. Separate independent Standards and Spec reviewers examined documented constraints, and a third reviewer searched for runtime and verification counterexamples. The parent reproduced accepted findings before fixes. Independent agents use the same configured model family.

## Standards findings

1. Benchmark samples could accept a caught startup failure. The browser bootstrap reports caught import failures through console.error while leaving SSR headings visible. The benchmark previously observed page/network errors but not console failures or completed initialization. A local HTTP200 module that throws reproduced the false pass. Shared observation now records console, HTTP, network and page errors; samples also require initialized application effects. The actual fault injection is rejected.
2. The default browser journeys ignored aborted image requests. The old console filter discarded the generic resource error and there was no requestfailed listener. Aborting the unchanged rocket WebP reproduced a healthy-looking pass. The common observer now records local failed requests in normal, alias, no-JavaScript and benchmark contexts. An intentional JavaScript-disabled context excludes only script failures marked CSP by Chromium; image and enabled-script failures remain errors.

## Spec findings

1. Host-normalized URLs could select a different hydration tree. Local requests such as /faq//index.html and /faq/%2findex.html received FAQ HTML, then selected NotFound and produced React errors 418/423. Each exported root now carries its validated registry identity in data-route. The browser hydrates that identity and resolves the URL only for an empty development shell. The original six browser cases now retain FAQ and produce no React errors. Server/deployment normalization policy remains unchanged.
2. Real React markup exposed Markdown conversion assumptions. Global nav removal dropped all six related-resource links on About and Contact. Compact adjacent spans merged category labels, and adjacent CTA anchors lacked separation. Conversion now selects main content, retains its related navigation, and excludes outer site chrome. Categories use semantic lists, and adjacent links retain readable spacing without adding spaces before punctuation. Generated-document and converter tests cover the lost information. The unused handwritten trust-page renderer and its dead tests were removed.
3. Proof paths could enter the published export. A disposable --public-dir fixture combined with --output-dir pointing inside it wrote results.json even when Chromium failed to launch. Destination validation now resolves symlink ancestors and rejects public/repository locations before creating files or starting runtimes. Existing and dangling symlink cases are covered. A safe external output still retains failed-run evidence.

## Regression evidence

- Application tests added before the fixes produced five failures: missing document identity, missing Markdown links, merged category labels, removed main-content navigation and adjacent anchor spacing. The covering tests now pass.
- Evidence-path tests failed three of four before the fix. All five current cases pass, including the added dangling-symlink case.
- The parent reproduced caught startup and aborted-image false passes. The fixed observer and readiness gate reject both real browser cases. The public-output reproduction now creates no proof files inside publicDir.
- The full production build, typecheck and all 204 tests pass.
- Seven no-JavaScript and hydrated routes, nine browser aliases, early disclosure state, failed module preservation, and both verifier rejection fixtures pass.
- The empty development shell and real FAQ HMR pass without a document reload. The original source is restored and owned runtimes are closed.

## Retained proof

- /private/tmp/shopstr-review-app-red.log contains the failing-before application checks.
- /private/tmp/shopstr-review-url-fixed.json records the six passing URL cases. Initial browser failure output was captured in this chat; the reproduction's default JSON was overwritten by its rerun and is not presented as failing-before evidence.
- /private/tmp/shopstr-review-verifier-red.log and shopstr-review-verifier-green.log record evidence-path regression results.
- /private/tmp/shopstr-review-verifier-repro.json and shopstr-review-verifier-fixed.json contain the original and fixed observer/output-path probes.
- /private/tmp/shopstr-deep-review-verified/results.json contains final route, alias, negative-fixture and five alternating samples per build.
- /private/tmp/shopstr-deep-review-dev-proof/results.json records renewed HMR verification.
- /private/tmp/shopstr-deep-review-final-tests.log and shopstr-deep-review-final-check.log record the combined checks.

## Disposition

No blocking findings remain after independent fix review. Empty browser-only metadata fields and standalone exporter rerun behavior were noted but are not current user-path defects. The documented full build regenerates its manifest. Published hosting remains unverified because this task does not deploy.
