import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("Pages output serves assets before delegating to Vinext", async () => {
  const entryUrl = new URL("../dist/pages/_worker.js/index.js", import.meta.url);
  const vinextUrl = new URL("../dist/pages/_worker.js/vinext.js", import.meta.url);
  const assetsUrl = new URL("../dist/pages/assets/", import.meta.url);
  const sitemapUrl = new URL("../dist/pages/sitemap.xml", import.meta.url);
  const robotsUrl = new URL("../dist/pages/robots.txt", import.meta.url);

  await Promise.all([access(entryUrl), access(vinextUrl), access(assetsUrl), access(sitemapUrl), access(robotsUrl)]);

  const [entry, assets, sitemap, robots] = await Promise.all([
    readFile(entryUrl, "utf8"),
    readdir(assetsUrl),
    readFile(sitemapUrl, "utf8"),
    readFile(robotsUrl, "utf8"),
  ]);

  assert.match(entry, /env\.ASSETS\.fetch\(request\)/);
  assert.match(entry, /www\.\$\{CANONICAL_HOST\}/);
  assert.match(entry, /Response\.redirect\(requestUrl\.toString\(\), 308\)/);
  assert.match(entry, /requestUrl\.pathname === "\/_vinext\/image"/);
  assert.match(entry, /env\.ASSETS\.fetch\(new Request\(sourceUrl, request\)\)/);
  assert.match(entry, /vinextWorker\.fetch\(request, env, context\)/);
  assert.ok(assets.some((asset) => asset.endsWith(".css")));
  assert.ok(assets.some((asset) => asset.endsWith(".js")));
  assert.match(sitemap, /<loc>https:\/\/pet-wildkind\.co\.uk\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/pet-wildkind\.co\.uk\/pricing<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/pet-wildkind\.co\.uk\/methodology<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/pet-wildkind\.co\.uk\/sample-field-guide<\/loc>/);
  assert.doesNotMatch(sitemap, /\/register|\/checkout/);
  assert.match(robots, /Sitemap: https:\/\/pet-wildkind\.co\.uk\/sitemap\.xml/);
});
