import http from "node:http";
import { lstat, readFile, realpath } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const folder = process.argv.includes("--site") ? resolve(root, "_site") : root;
const prefix = "/30DayMapChallenge2026";
const port = Number(process.env.PORT ?? 4174);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be an integer between 1 and 65535.");
const servedRoot = await realpath(folder);
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json", ".geojson": "application/geo+json", ".md": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
  ".ico": "image/x-icon", ".pdf": "application/pdf", ".wasm": "application/wasm"
};
http.createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const url = new URL(request.url, "http://localhost");
    if (url.pathname === "/" || url.pathname === prefix) {
      response.writeHead(302, { Location: prefix + "/" }).end();
      return;
    }
    if (!url.pathname.startsWith(prefix + "/")) {
      response.writeHead(404).end("Preview is mounted at " + prefix + "/");
      return;
    }
    const route = decodeURIComponent(url.pathname.slice(prefix.length + 1));
    if (route.split(/[\\/]/).some((part) => part.startsWith("."))) {
      response.writeHead(403).end("Not served.");
      return;
    }
    let target = resolve(servedRoot, route);
    if (target !== servedRoot && !target.startsWith(servedRoot + sep)) {
      response.writeHead(403).end("Not served.");
      return;
    }
    const info = await lstat(target);
    if (info.isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(302, { Location: url.pathname + "/" + url.search }).end();
        return;
      }
      target = resolve(target, "index.html");
    }
    const actual = await realpath(target);
    if (!actual.startsWith(servedRoot + sep)) {
      response.writeHead(403).end("Not served.");
      return;
    }
    response.writeHead(200, {
      "Content-Type": types[extname(actual).toLowerCase()] ?? "application/octet-stream",
      "Cache-Control": "no-store",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    });
    response.end(request.method === "HEAD" ? undefined : await readFile(actual));
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found.");
  }
}).listen(port, "127.0.0.1", () => {
  console.log("Local: http://127.0.0.1:" + port + prefix + "/");
  console.log("Serving " + (folder === root ? "source files" : "the _site/ Pages artifact") + ". Press Ctrl+C to stop.");
});

