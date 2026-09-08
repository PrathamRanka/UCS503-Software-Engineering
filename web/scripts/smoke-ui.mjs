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
  id: "user-john",
  name: "John Doe",
  username: "johndoe",
  email: "john.doe@thapar.edu",
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
  const authPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await authPage.goto(baseURL);
  await authPage.getByPlaceholder("TIET email").fill("student@gmail.com");
  await authPage.getByPlaceholder("Password").fill("password123");
  await authPage.getByRole("button", { name: "Sign in", exact: true }).click();
  await authPage.getByText("Use your official TIET email address (@thapar.edu).").waitFor();
  await authPage.close();

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
  await page.getByText("Good afternoon, John.").waitFor();
  await page.getByText("STUDENT UPDATE").first().waitFor();
  await page.getByRole("heading", { name: "John Doe" }).first().waitFor();
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
  const reelsShot = join(tmpdir(), "titalks-reels.png");
  await page.screenshot({ path: desktopShot, fullPage: true });

  await page.getByRole("button", { name: "Pulse", exact: true }).first().click();
  await page.waitForURL("**/pulse");
  await page.getByRole("button", { name: "Sport", exact: true }).click();
  await page.getByRole("button", { name: /URJA/ }).click();
  await page.getByRole("button", { name: "Add to my day", exact: true }).click();
  await page.getByRole("button", { name: "Added to your day", exact: true }).waitFor();
  await page.keyboard.press("Escape");

  for (const [label, path] of [["Reels", "/reels"], ["People", "/people"], ["Inbox", "/inbox"], ["Activity", "/activity"]]) {
    await page.getByRole("button", { name: label, exact: true }).first().click();
    await page.waitForURL(`**${path}`);
    if (label === "Reels") {
      await page.getByRole("heading", { name: "Reels", exact: true }).waitFor();
      const feed = page.getByTestId("reels-feed");
      const cards = page.getByTestId("reel-card");
      await page.getByRole("button", { name: "Previous reel" }).waitFor();
      await page.getByRole("button", { name: "Next reel" }).waitFor();
      await page.getByLabel(/Sound:/).first().waitFor();
      if (await feed.locator('a[href^="http"], iframe').count())
        throw new Error("Reels must not contain external links or embeds");
      const initialCount = await cards.count();
      if (initialCount !== 5) throw new Error(`Expected 5 initial reels, received ${initialCount}`);
      await feed.evaluate((element) => element.scrollTo({ top: element.scrollHeight, behavior: "auto" }));
      await page.waitForFunction(() => document.querySelectorAll('[data-testid="reel-card"]').length > 5);
      await page.getByRole("button", { name: "Like reel" }).first().click();
      await page.getByRole("button", { name: "Unlike reel" }).first().waitFor();
      await page.screenshot({ path: reelsShot, fullPage: false });
    }
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
  await mobile.getByText("Good afternoon, John.").waitFor();
  await mobile.screenshot({ path: mobileShot, fullPage: true });
  await browser.close();
  if (errors.length) throw new Error(`Browser errors: ${errors.join(" | ")}`);
  console.log(`UI smoke test passed\n${desktopShot}\n${mobileShot}\n${reelsShot}`);
} finally {
  server.close();
}
