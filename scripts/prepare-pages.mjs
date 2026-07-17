import { copyFile, cp, mkdir, rename, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "dist", "client");
const serverDir = path.join(root, "dist", "server");
const pagesDir = path.join(root, "dist", "pages");
const workerDir = path.join(pagesDir, "_worker.js");

await rm(pagesDir, { recursive: true, force: true });
await mkdir(pagesDir, { recursive: true });

// Pages advanced mode serves static files from the project root and loads a
// module Worker from `_worker.js`. Vinext already emits the correct Worker;
// retaining its directory structure preserves the server-side import graph.
await cp(clientDir, pagesDir, { recursive: true });
await mkdir(workerDir, { recursive: true });
await cp(serverDir, workerDir, { recursive: true });

// Pages advanced mode sends every request through `_worker.js`. Keep Vinext as
// an internal module and put an asset-aware entry point in front of it so CSS,
// JavaScript, images, and other public files reach the browser before dynamic
// routes fall through to the application.
await rename(path.join(workerDir, "index.js"), path.join(workerDir, "vinext.js"));
await copyFile(
  path.join(root, "scripts", "pages-worker-entry.mjs"),
  path.join(workerDir, "index.js"),
);

// The Vinext Wrangler file describes a standalone Worker. Pages reads project
// settings from its own dashboard/API, so keeping this nested file would make
// Wrangler see two conflicting deployment configurations.
await rm(path.join(workerDir, "wrangler.json"), { force: true });

console.log("Prepared Cloudflare Pages output in dist/pages");
