import { cp, lstat, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { basename, extname, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "_site");
const allowedExtensions = new Set([
  ".html", ".css", ".js", ".mjs", ".json", ".geojson", ".csv", ".tsv", ".md", ".txt",
  ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".avif",
  ".woff", ".woff2", ".ttf", ".otf", ".wasm", ".pdf", ".mp3", ".ogg", ".wav",
  ".mp4", ".webm", ".gpx", ".kml", ".kmz", ".tif", ".tiff", ".pmtiles", ".pbf"
]);
const ignoredDirectories = new Set(["dist", "node_modules", "scripts"]);
const publishingSources = ["index.html", "README.md", "NOTICE.md", "directory", "docs", ...Array.from({ length: 30 }, (_, i) => "day" + (i + 1))];
let count = 0;

for (const entry of publishingSources) {
  const exists = await lstat(resolve(root, entry)).catch((error) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (!exists) throw new Error("Missing required publishing source: " + entry);
}

// _site is disposable build output. Check the exact resolved target before removing it.
if (!output.startsWith(root + sep) || basename(output) !== "_site") {
  throw new Error("Refusing to clean a directory outside this repository's _site output.");
}
const existing = await lstat(output).catch((error) => {
  if (error.code === "ENOENT") return null;
  throw error;
});
if (existing?.isSymbolicLink()) throw new Error("_site must not be a symbolic link.");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const render = spawnSync(process.execPath, [resolve(root, "scripts/render-directory.mjs")], {
  cwd: root, stdio: "inherit"
});
if (render.status !== 0) throw new Error("Directory generation failed.");

async function copyWebFiles(source, destination) {
  const info = await lstat(source);
  if (info.isSymbolicLink()) throw new Error("Symbolic links are not published: " + relative(root, source));
  if (info.isDirectory()) {
    const name = basename(source);
    if (name.startsWith(".") || ignoredDirectories.has(name.toLowerCase())) return;
    await mkdir(destination, { recursive: true });
    for (const entry of await readdir(source)) {
      await copyWebFiles(resolve(source, entry), resolve(destination, entry));
    }
    return;
  }
  const name = basename(source);
  if (source === resolve(root, "directory/template.html")) return;
  if (name.startsWith(".") || name === "package.json" || name === "package-lock.json") return;
  if (!allowedExtensions.has(extname(name).toLowerCase())) return;
  await mkdir(resolve(destination, ".."), { recursive: true });
  await cp(source, destination);
  count++;
}

for (const entry of publishingSources) {
  const source = resolve(root, entry);
  await copyWebFiles(source, resolve(output, entry));
}
await writeFile(resolve(output, ".nojekyll"), "");
console.log("Built " + count + " web and documentation files in _site/ (local hosting metadata and build tools excluded).");

