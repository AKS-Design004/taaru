import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the landing page with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("TAARU - Mode & Beauté");
  });

  test("should display hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Toute la mode et la beauté à portée de clic")).toBeVisible();
  });

  test("should display search bar", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByPlaceholder("Que recherchez-vous ? (prestataire, ville, catégorie...)")
    ).toBeVisible();
  });

  test("should display navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Prestataires")).toBeVisible();
    await expect(page.getByText("Connexion")).toBeVisible();
    await expect(page.getByText("Inscription")).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Connexion").click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByText("Connectez-vous à votre compte")).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Inscription").click();
    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(page.getByText("Créez votre compte")).toBeVisible();
  });

  test("should navigate to providers page", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Prestataires").click();
    await expect(page).toHaveURL(/\/providers/);
    await expect(page.getByText("Découvrez les meilleurs professionnels près de chez vous")).toBeVisible();
  });

  test("should display category grid", async ({ page }) => {
    await page.goto("/");
    for (const cat of ["Mode", "Couture", "Beauté", "Événementiel"]) {
      await expect(page.getByText(cat).first()).toBeVisible();
    }
  });

  test("should show footer copyright", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("TAARU. Tous droits réservés.")).toBeVisible();
  });
});
