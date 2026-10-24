import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const root = fileURLToPath(new URL("../", import.meta.url));
const helper = join(root, "scripts/verify-browser.mjs");
async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
function run(args) {
  return new Promise((done) => {
    execFile(
      process.execPath,
      [helper, ...args],
      {
        cwd: root,
        timeout: 20000,
        env: {
          ...process.env,
          PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH:
            "/missing-verification-test-chromium",
        },
      },
      (error, stdout, stderr) =>
        done({ code: error?.code ?? 0, stdout, stderr }),
    );
  });
}
async function fixture() {
  const scratch = await mkdtemp(join(tmpdir(), "shopstr-evidence-policy-"));
  const publicDir = join(scratch, "public");
  await mkdir(publicDir);
  await writeFile(
    join(publicDir, "index.html"),
    "<!doctype html><main><h1>Shopstr Markets</h1></main>",
  );
  await writeFile(join(publicDir, "index.md"), "# Shopstr Markets");
  return { scratch, publicDir };
}

for (const mode of ["public", "symlink", "dangling-symlink", "repository"]) {
  test(`browser evidence rejects ${mode} output before writing or starting Chromium`, async () => {
    const { scratch, publicDir } = await fixture();
    let output = join(publicDir, "proof");
    const repositoryOutput = join(root, `.review-proof-${randomUUID()}`);
    try {
      if (mode === "symlink" || mode === "dangling-symlink") {
        const alias = join(scratch, "public-link");
        await symlink(
          mode === "symlink" ? publicDir : join(publicDir, "missing-parent"),
          alias,
          "dir",
        );
        output = join(alias, "not-yet-created", "proof");
      }
      if (mode === "repository") output = repositoryOutput;
      const result = await run([
        "--public-dir",
        publicDir,
        "--output-dir",
        output,
      ]);
      assert.notEqual(result.code, 0);
      assert.equal(
        await exists(output),
        false,
        "Rejected evidence paths must not be created",
      );
      assert.match(
        result.stderr,
        /outside.*(?:public|repository)|(?:public|repository).*outside/i,
      );
      assert.ok(
        !result.stdout.includes('"status"'),
        "Validation must precede server/browser execution",
      );
    } finally {
      await rm(repositoryOutput, { recursive: true, force: true });
      await rm(scratch, { recursive: true, force: true });
    }
  });
}

test("external evidence survives a failed browser launch", async () => {
  const { scratch, publicDir } = await fixture();
  const output = join(scratch, "evidence");
  try {
    const result = await run([
      "--public-dir",
      publicDir,
      "--output-dir",
      output,
    ]);
    assert.notEqual(result.code, 0);
    const proof = JSON.parse(
      await readFile(join(output, "results.json"), "utf8"),
    );
    assert.equal(proof.status, "failed");
    assert.match(proof.error, /executable.*exist|failed to launch/i);
    assert.equal(await exists(join(publicDir, "results.json")), false);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
