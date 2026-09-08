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
  id: "user-pratham",
  name: "Pratham Ranka",
  username: "prathamranka",
  email: "pratham.ranka@thapar.edu",
  avatar: "/pratham-ranka.webp",
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
  await page.route("https://api.open-meteo.com/**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        current: {
          temperature_2m: 31.6,
          apparent_temperature: 34.1,
          weather_code: 1,
          is_day: 1,
        },
      }),
    }),
  );
  await page.goto(baseURL);
  await page.evaluate((user) => localStorage.setItem("titalks-session-v1", JSON.stringify(user)), demoUser);
  await page.reload();
  await page.getByText("Good afternoon, Pratham.").waitFor();
  await page.getByText("Mainly clear · Patiala").waitFor();
  const sidebar = page.locator("aside").first();
  const collapsedWidth = await sidebar.evaluate((element) => element.getBoundingClientRect().width);
  const sidebarBounds = await sidebar.boundingBox();
  const inboxButton = page.getByRole("button", { name: "Inbox", exact: true });
  const inboxBounds = await inboxButton.boundingBox();
  const badgeBounds = await inboxButton.locator("b").boundingBox();
  if (!sidebarBounds || !inboxBounds || !badgeBounds) throw new Error("Sidebar geometry unavailable");
  if (inboxBounds.x < sidebarBounds.x || inboxBounds.x + inboxBounds.width > sidebarBounds.x + sidebarBounds.width)
    throw new Error("Inbox button escapes collapsed sidebar");
  if (badgeBounds.x < sidebarBounds.x || badgeBounds.x + badgeBounds.width > sidebarBounds.x + sidebarBounds.width)
    throw new Error("Inbox badge is clipped in collapsed sidebar");
  await sidebar.hover();
  await page.waitForTimeout(250);
  const expandedWidth = await sidebar.evaluate((element) => element.getBoundingClientRect().width);
  if (expandedWidth <= collapsedWidth) throw new Error("Sidebar did not expand on hover");
  await page.screenshot({ path: join(tmpdir(), "titalks-sidebar-hover.png"), fullPage: false });
  await page.getByRole("button", { name: "Collapse right panel" }).click();
  await page.getByRole("button", { name: "Expand right panel" }).waitFor();
  await page.getByRole("button", { name: "Expand right panel" }).click();
  await page.getByRole("button", { name: /Open map/i }).click();
  await page.getByRole("heading", { name: "Find your way around" }).waitFor();
  await page.getByAltText(/Illustrated map of the TIET campus/i).waitFor();
  await page.keyboard.press("Escape");
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
  await mobile.route("https://api.open-meteo.com/**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        current: {
          temperature_2m: 31.6,
          apparent_temperature: 34.1,
          weather_code: 1,
          is_day: 1,
        },
      }),
    }),
  );
  await mobile.goto(baseURL);
  await mobile.evaluate((user) => localStorage.setItem("titalks-session-v1", JSON.stringify(user)), demoUser);
  await mobile.reload();
  await mobile.getByText("Good afternoon, Pratham.").waitFor();
  await mobile.screenshot({ path: mobileShot, fullPage: true });
  await browser.close();
  if (errors.length) throw new Error(`Browser errors: ${errors.join(" | ")}`);
  console.log(`UI smoke test passed\n${desktopShot}\n${mobileShot}`);
} finally {
  server.close();
}
