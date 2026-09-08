import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";

const baseURL = "http://127.0.0.1:4173";
const distDirectory = process.env.TITALKS_DIST ?? "dist";
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".mp4": "video/mp4" };
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, baseURL).pathname;
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    let body;
    try { body = await readFile(join(distDirectory, relative)); }
    catch { body = await readFile(join(distDirectory, "index.html")); }
    response.writeHead(200, { "content-type": mime[extname(relative)] ?? "text/html" });
    response.end(body);
  } catch {
    response.writeHead(500); response.end();
  }
});

const demoUser = {
  id: "user-riya",
  name: "Riya Sharma",
  username: "riyasharma",
  email: "riya.sharma@thapar.edu",
  avatar: "/images/riya.webp",
  bio: "Computer Engineering · campus builder",
  branch: "Computer Engineering",
  year: "Third year",
  followers: 1248,
  following: 486,
};

try {
  await new Promise((resolve) => server.listen(4173, "127.0.0.1", resolve));
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseURL);
  await page.evaluate((user) => localStorage.setItem("titalks-session-v1", JSON.stringify(user)), demoUser);
  await page.reload();
  await page.getByText("Good afternoon, Riya.").waitFor();
  const desktopShot = join(tmpdir(), "titalks-home.png");
  const mobileShot = join(tmpdir(), "titalks-mobile.png");
  await page.screenshot({ path: desktopShot, fullPage: true });

  for (const [label, path] of [["Pulse", "/pulse"], ["Spaces", "/spaces"], ["People", "/people"], ["Inbox", "/inbox"], ["Activity", "/activity"]]) {
    await page.getByRole("button", { name: label, exact: true }).first().click();
    await page.waitForURL(`**${path}`);
  }

  await page.getByRole("button", { name: "Add to campus" }).click();
  await page.getByRole("heading", { name: "What are you making happen?" }).waitFor();
  await page.keyboard.press("Escape");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await mobile.goto(baseURL);
  await mobile.evaluate((user) => localStorage.setItem("titalks-session-v1", JSON.stringify(user)), demoUser);
  await mobile.reload();
  await mobile.getByText("Good afternoon, Riya.").waitFor();
  await mobile.screenshot({ path: mobileShot, fullPage: true });
  await browser.close();
  if (errors.length) throw new Error(`Browser errors: ${errors.join(" | ")}`);
  console.log(`UI smoke test passed\n${desktopShot}\n${mobileShot}`);
} finally {
  server.close();
}
