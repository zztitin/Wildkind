import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("Pages output serves assets before delegating to Vinext", async () => {
  const entryUrl = new URL("../dist/pages/_worker.js/index.js", import.meta.url);
  const vinextUrl = new URL("../dist/pages/_worker.js/vinext.js", import.meta.url);
  const assetsUrl = new URL("../dist/pages/assets/", import.meta.url);

  await Promise.all([access(entryUrl), access(vinextUrl), access(assetsUrl)]);

  const [entry, assets] = await Promise.all([
    readFile(entryUrl, "utf8"),
    readdir(assetsUrl),
  ]);

  assert.match(entry, /env\.ASSETS\.fetch\(request\)/);
  assert.match(entry, /vinextWorker\.fetch\(request, env, context\)/);
  assert.ok(assets.some((asset) => asset.endsWith(".css")));
  assert.ok(assets.some((asset) => asset.endsWith(".js")));
});
