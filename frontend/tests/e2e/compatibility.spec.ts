import { test, expect } from "@playwright/test";

test.describe("Compatibilité — Responsive Design", () => {
  const viewports = [
    { width: 375, height: 667, name: "mobile" },
    { width: 768, height: 1024, name: "tablet" },
    { width: 1280, height: 800, name: "desktop" },
    { width: 1920, height: 1080, name: "wide" },
  ];

  for (const vp of viewports) {
    test(`homepage should render at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await expect(page.getByText("TAARU")).toBeVisible();
      await expect(page.getByText("Toute la mode et la beauté à portée de clic")).toBeVisible();
    });

    test(`providers page should render at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/providers");
      await expect(page.getByText("Découvrez les meilleurs professionnels près de chez vous")).toBeVisible();
    });
  }
});

test.describe("Compatibilité — Navigation", () => {
  test("should navigate from homepage to register and back", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Inscription").click();
    await expect(page).toHaveURL(/\/auth\/register/);
    await page.getByText("Se connecter").first().click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await page.getByText("S'inscrire").click();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test("should handle browser back button", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Connexion").click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await page.goBack();
    await expect(page).toHaveURL("/");
    await page.goForward();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe("Compatibilité — API Contract", () => {
  test("health endpoint should return expected JSON structure", async ({ request }) => {
    const res = await request.get("http://localhost:8080/api/health");
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty("status");
    expect(json).toHaveProperty("timestamp");
    expect(json).toHaveProperty("service");
    expect(json.status).toBe("UP");
  });

  test("auth register endpoint should return consistent response structure", async ({ request }) => {
    const email = `contract_${Date.now()}@taaru.sn`;
    const res = await request.post("http://localhost:8080/api/auth/register", {
      data: {
        email,
        password: "Test@1234",
        firstName: "Contract",
        lastName: "Test",
        role: "CLIENT",
      },
    });
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty("success");
    expect(json).toHaveProperty("message");
    expect(json).toHaveProperty("data");
    expect(json.data).toHaveProperty("accessToken");
    expect(json.data).toHaveProperty("refreshToken");
    expect(json.data).toHaveProperty("tokenType");
    expect(json.data).toHaveProperty("expiresIn");
    expect(json.data).toHaveProperty("user");
    expect(json.data.user).toHaveProperty("id");
    expect(json.data.user).toHaveProperty("email");
    expect(json.data.user).toHaveProperty("role");
  });

  test("featured providers endpoint should return consistent structure", async ({ request }) => {
    const res = await request.get("http://localhost:8080/api/providers/featured");
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty("success");
    expect(json).toHaveProperty("data");
    expect(Array.isArray(json.data)).toBeTruthy();
  });
});
