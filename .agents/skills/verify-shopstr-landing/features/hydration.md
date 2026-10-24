# Hydration and route delivery

The prerendered page stays visible while only its own interactive code loads.

## Sub-features

Same main node before and after hydration; page/module isolation; mobile-menu toggles; disclosure interaction; host-normalized URL aliases; deliberate verifier fault rejection.

## How to get to it (user POV)

Open any public route directly, refresh, then interact with the menu and disclosures.

## Driving it with the browser helper

Preconditions: locked dependencies, Chromium and a successful production build.

Run `npm run verify:browser -- --output-dir /private/tmp/shopstr-hydration-proof`. The helper captures the initial main before scripts run, checks node identity after effects, records errors and script URLs, opens/closes the menu and uses native details. Add --baseline-dir and --samples 5 for alternating cold-load diagnostics.

## Gotchas

Fresh contexts prevent cache carryover. Page chunks may share common dependencies. Only unrelated page-specific modules are forbidden. The served data-route chooses the hydration tree even when a host normalizes duplicate or encoded separators in the URL. A remount or swallowed hydration error is a failure.
