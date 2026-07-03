import { test, expect } from "@playwright/test";

test.describe("PWA", () => {
  test("should have a manifest link", async ({ page }) => {
    await page.goto("/");
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeVisible();
    const href = await manifestLink.getAttribute("href");
    expect(href).toBeTruthy();
  });

  test("should serve manifest.json", async ({ page }) => {
    const res = await page.request.get("/manifest.json");
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.name).toBeTruthy();
    expect(json.short_name).toBeTruthy();
    expect(json.icons).toBeDefined();
    expect(json.icons.length).toBeGreaterThanOrEqual(2);
  });

  test("should have service worker registration", async ({ page }) => {
    await page.goto("/");
    const hasSw = await page.evaluate(() => "serviceWorker" in navigator);
    expect(hasSw).toBeTruthy();
  });

  test("should have apple-touch-icon", async ({ page }) => {
    await page.goto("/");
    const appleIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleIcon).toBeVisible();
    const href = await appleIcon.getAttribute("href");
    expect(href).toBeTruthy();
  });

  test("should have theme-color meta", async ({ page }) => {
    await page.goto("/");
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toBeVisible();
    const content = await themeColor.getAttribute("content");
    expect(content).toBeTruthy();
  });
});
