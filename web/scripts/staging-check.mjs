import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const distDirectory = process.env.TITALKS_DIST ?? "dist";
const mime = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".webp": "image/webp",
};

await stat(join(distDirectory, "index.html"));

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  const candidate = normalize(join(distDirectory, pathname.slice(1)));
  try {
    const body = await readFile(pathname === "/" ? join(distDirectory, "index.html") : candidate);
    response.writeHead(200, { "content-type": mime[extname(candidate)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    const body = await readFile(join(distDirectory, "index.html"));
    response.writeHead(200, { "content-type": "text/html" });
    response.end(body);
  }
});

try {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Staging port unavailable");
  const origin = `http://127.0.0.1:${address.port}`;

  const home = await fetch(origin);
  const html = await home.text();
  if (!home.ok || !html.includes('<div id="root"></div>')) {
    throw new Error("Staging entry page failed");
  }

  for (const route of ["/people", "/pulse", "/reels", "/inbox", "/activity", "/profile", "/settings"]) {
    const response = await fetch(`${origin}${route}`);
    const body = await response.text();
    if (!response.ok || !body.includes('<div id="root"></div>')) {
      throw new Error(`SPA rewrite failed for ${route}`);
    }
  }

  const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map((match) => match[1]);
  if (assets.length < 2) throw new Error("Built JavaScript and CSS assets were not found");
  for (const asset of assets) {
    const response = await fetch(new URL(asset, origin));
    if (!response.ok || Number(response.headers.get("content-length") ?? 1) === 0) {
      throw new Error(`Built asset unavailable: ${asset}`);
    }
  }

  console.log(`Staging checks passed: ${assets.length} assets and 7 deep routes verified`);
} finally {
  server.close();
}
