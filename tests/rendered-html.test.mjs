import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("build contains the WildKind product shell", async () => {
  await access(new URL("../dist/server/index.js", import.meta.url));
  const [page, app, layout, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/WildKindApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(page, /<WildKindApp initialUser=/);
  assert.match(app, /What&apos;s Your Pet&apos;s/);
  assert.match(app, /Begin the expedition/);
  assert.match(app, /Five coordinates/);
  assert.match(layout, /Pet personality, carefully mapped/);
  assert.match(css, /--obsidian:#1a1816/);
  assert.doesNotMatch(`${page}${app}${layout}`, /codex-preview|react-loading-skeleton|Starter Project/i);
});
