import assert from "node:assert/strict";
import { lstat, readlink, realpath } from "node:fs/promises";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";

async function canonicalLocation(path) {
  try {
    return await realpath(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    try {
      const entry = await lstat(path);
      if (entry.isSymbolicLink()) {
        return canonicalLocation(resolve(dirname(path), await readlink(path)));
      }
    } catch (missing) {
      if (missing.code !== "ENOENT") throw missing;
    }
    const parent = dirname(path);
    if (parent === path) throw error;
    return join(await canonicalLocation(parent), basename(path));
  }
}

function contains(parent, child) {
  const path = relative(parent, child);
  return (
    path === "" ||
    (path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path))
  );
}

export async function resolveEvidenceDirectory(
  output,
  { publicDir, repositoryDir },
) {
  const [destination, published, repository] = await Promise.all([
    canonicalLocation(resolve(output)),
    canonicalLocation(resolve(publicDir)),
    canonicalLocation(resolve(repositoryDir)),
  ]);
  assert.ok(
    !contains(published, destination),
    "Evidence output must stay outside the public directory",
  );
  assert.ok(
    !contains(repository, destination),
    "Evidence output must stay outside the repository",
  );
  return destination;
}

export function observePageFailures(
  page,
  url,
  { javaScriptEnabled = true } = {},
) {
  const origin = new URL(url).origin;
  const local = (value) => new URL(value).origin === origin;
  const failures = [];
  page.on("pageerror", (error) =>
    failures.push({ kind: "page", message: error.message }),
  );
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !/^Failed to load resource(?::|$)/.test(message.text())
    ) {
      failures.push({ kind: "console", message: message.text() });
    }
  });
  page.on("response", (response) => {
    if (local(response.url()) && response.status() >= 400) {
      failures.push({
        kind: "http",
        url: response.url(),
        status: response.status(),
      });
    }
  });
  page.on("requestfailed", (request) => {
    const disabledScript =
      !javaScriptEnabled &&
      request.resourceType() === "script" &&
      request.failure()?.errorText === "csp";
    if (local(request.url()) && !disabledScript) {
      failures.push({
        kind: "network",
        url: request.url(),
        message: request.failure()?.errorText,
      });
    }
  });
  return failures;
}

export async function waitForApplicationReady(page, failures) {
  assert.deepEqual(
    failures,
    [],
    "Browser failed before initialization completed",
  );
  await page.waitForFunction(() => document.body.style.overflow === "unset");
  assert.deepEqual(failures, [], "Browser failed during initialization");
}
