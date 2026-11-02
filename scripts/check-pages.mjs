import { createHash } from 'node:crypto';
import assert from "node:assert/strict";
import { lstat, readFile, readdir } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const site = resolve(root, "_site");
const manifest = JSON.parse(await readFile(resolve(root, "directory/days.json"), "utf8"));
assert.equal(manifest.days.length, 30, "Directory must describe all 30 days.");
assert.deepEqual(manifest.days.map((day) => day.day).sort((a, b) => a - b), Array.from({ length: 30 }, (_, i) => i + 1));
const pages = new URL(manifest.pagesBase);
assert.equal(pages.pathname, "/30DayMapChallenge2026/", "Keep the project Pages base path explicit.");
const seenDates = new Set();
for (const day of manifest.days) {
  assert(day.description?.trim(), "Every day needs a description.");
  assert(!seenDates.has(day.date), "Dates must be unique.");
  seenDates.add(day.date);
  for (const name of ["index.html", "readme.md"]) {
    assert((await lstat(resolve(site, "day" + day.day, name))).isFile(), "Missing day page or notes.");
  }
}

const files = [];
async function walk(folder) {
  for (const name of await readdir(folder)) {
    const file = resolve(folder, name), info = await lstat(file);
    assert(!info.isSymbolicLink(), "A Pages artifact must not contain symbolic links.");
    const parts = relative(site, file).split(sep);
    assert(!parts.some((part) => [".git", ".openai", ".agents", ".codex", "node_modules", "dist", "scripts"].includes(part)), "Build or private metadata leaked into the Pages artifact: " + parts.join("/"));
    assert(!["package.json", "package-lock.json"].includes(name), "Package manifests are not site runtime.");
    if (info.isDirectory()) await walk(file);
    else files.push(file);
  }
}
await walk(site);
for (const path of ["index.html", "directory/index.html", "directory/days.json", "day1/js/app.js", "day1/js/player.js", "day1/collage.css", "day1/data/tour.geojson", "day1/data/countries.geojson", "day1/data/states.geojson", "day1/data/setlists.json", ".nojekyll"]) {
  assert((await lstat(resolve(site, path))).isFile(), "Missing published runtime: " + path);
}

const directoryHtml = await readFile(resolve(site, "directory/index.html"), "utf8");
for (const day of manifest.days) {
  assert(directoryHtml.includes("day" + day.day + "/"), "Directory needs a local Pages link for day " + day.day);
  assert(directoryHtml.includes(manifest.repository + "/tree/" + manifest.branch + "/day" + day.day), "Directory needs a repository source link for day " + day.day);
}

let checked = 0;
async function verifyReference(source, value, base = dirname(source)) {
  const decoded = value.replaceAll("&amp;", "&").trim();
  if (!decoded || decoded.startsWith("#") || decoded.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(decoded)) return;
  let pathname = decoded.split(/[?#]/)[0];
  if (!pathname) return;
  pathname = decodeURIComponent(pathname);
  if (pathname.startsWith("/")) {
    assert(pathname.startsWith(pages.pathname), "Root-relative URL breaks project Pages hosting in " + relative(site, source) + ": " + decoded);
    pathname = pathname.slice(pages.pathname.length);
    base = site;
  }
  const target = resolve(base, pathname);
  assert(target === site || target.startsWith(site + sep), "Reference escapes the Pages artifact: " + decoded);
  const info = await lstat(target).catch(() => null);
  assert(info, "Broken local reference in " + relative(site, source) + ": " + decoded);
  if (info.isDirectory()) assert((await lstat(resolve(target, "index.html")).catch(() => null))?.isFile(), "Directory link needs index.html: " + decoded);
  checked++;
}
for (const file of files) {
  const extension = extname(file);
  if (![".html", ".css", ".js", ".mjs", ".md"].includes(extension)) continue;
  const content = await readFile(file, "utf8");
  if (extension === ".html") {
    for (const match of content.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) await verifyReference(file, match[1]);
  }
  if (extension === ".css") {
    for (const match of content.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi)) {
      await verifyReference(file, match[1] ?? match[2] ?? match[3]);
    }
  }
  if (extension === ".md") {
    const prose = content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
    for (const match of prose.matchAll(/!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\s*\)/g)) {
      await verifyReference(file, match[1] ?? match[2]);
    }
  }
  if ([".js", ".mjs"].includes(extension)) {
    for (const match of content.matchAll(/\b(?:from\s*|import\s*\()\s*["']([^"']+)["']/g)) {
      if (match[1].startsWith(".")) await verifyReference(file, match[1]);
    }
    for (const match of content.matchAll(/new URL\(\s*["']([^"']+)["']\s*,\s*import\.meta\.url\s*\)/g)) await verifyReference(file, match[1]);
    // Browser fetch/json helpers resolve against the containing document, not the JS module.
    let pageFolder = dirname(file);
    while (pageFolder !== site && !(await lstat(resolve(pageFolder, "index.html")).catch(() => null))) pageFolder = dirname(pageFolder);
    for (const match of content.matchAll(/\b(?:fetch|json)\(\s*["']([^"']+)["']/g)) {
      await verifyReference(file, match[1], pageFolder);
    }
  }
}
console.log("PASS: 30 dated entries, per-day source and Pages links, " + checked + " local runtime references, project subpath compatibility, and a clean static artifact.");


// Verify deployed HTML and modules request the matching asset revision.
const day2Html = await readFile(resolve(site,'day2/index.html'),'utf8');
const day2App = await readFile(resolve(site,'day2/app.js'),'utf8');
const contentHash = (value) => createHash('sha256').update(value.replace(/\r\n/g,'\n')).digest('hex').slice(0,12);
for (const [file, source] of [['style.css', await readFile(resolve(site,'day2/style.css'),'utf8')], ['app.js', day2App]]) {
  assert(day2Html.includes(file + '?v=' + contentHash(source)), 'Day 2 stylesheet version or app version must match published content: ' + file);
}
const day2Navigation = await readFile(resolve(site,'day2/navigation.js'),'utf8');
assert(day2App.includes('./navigation.js?v=' + contentHash(day2Navigation)), 'Day 2 navigation import must have a matching content version.');
console.log('PASS: Day 2 published asset versions match the HTML, CSS, and JavaScript.');
