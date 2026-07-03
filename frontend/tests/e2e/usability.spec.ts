import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Usability — Accessibility", () => {
  test("homepage should have no critical a11y violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
    expect(results.violations.filter((v) => v.impact === "serious")).toEqual([]);
  });

  test("login page should have no critical a11y violations", async ({ page }) => {
    await page.goto("/auth/login");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
  });

  test("register page should have no critical a11y violations", async ({ page }) => {
    await page.goto("/auth/register");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
  });

  test("providers list should have no critical a11y violations", async ({ page }) => {
    await page.goto("/providers");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
  });
});

test.describe("Usability — Keyboard Navigation", () => {
  test("should navigate login form with Tab", async ({ page }) => {
    await page.goto("/auth/login");
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Email")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Mot de passe")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Se connecter" })).toBeFocused();
  });

  test("should submit login form with Enter", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel("Email").fill("test@test.sn");
    await page.getByLabel("Mot de passe").fill("wrong");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Erreur de connexion")).toBeVisible();
  });

  test("should navigate between pages with keyboard", async ({ page }) => {
    await page.goto("/");
    const providersLink = page.getByText("Prestataires");
    await providersLink.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/providers/);
  });
});

test.describe("Usability — Form Validation", () => {
  test("should show required field error on empty login", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("should show validation on password mismatch in register", async ({ page }) => {
    await page.goto("/auth/register");
    await page.getByLabel("Prénom").fill("Test");
    await page.getByLabel("Nom").fill("User");
    await page.getByLabel("Email").fill(`test_${Date.now()}@taaru.sn`);
    await page.getByLabel("Mot de passe").fill("Test@1234");
    await page.getByLabel("Confirmer le mot de passe").fill("Different1");
    await page.getByLabel("Vous êtes").selectOption("CLIENT");
    await page.getByRole("button", { name: "Créer mon compte" }).click();
    await expect(page.getByText("Les mots de passe ne correspondent pas")).toBeVisible();
  });

  test("should clear form validation after fix", async ({ page }) => {
    await page.goto("/auth/register");
    await page.getByRole("button", { name: "Créer mon compte" }).click();
    await page.getByLabel("Prénom").fill("Test");
    await page.getByLabel("Nom").fill("User");
    await page.getByLabel("Email").fill(`valid_${Date.now()}@taaru.sn`);
    await page.getByLabel("Mot de passe").fill("Test@1234");
    await page.getByLabel("Confirmer le mot de passe").fill("Test@1234");
    await page.getByLabel("Vous êtes").selectOption("CLIENT");
  });
});

test.describe("Usability — Empty and Error States", () => {
  test("should show empty state on providers page when no results", async ({ page }) => {
    await page.goto("/providers?city=NotFoundCityXYZ");
    await expect(page.getByText("Aucun prestataire trouvé")).toBeVisible();
  });

  test("should show not-found state for invalid provider", async ({ page }) => {
    await page.goto("/providers/00000000-0000-0000-0000-000000000000");
    await expect(page.getByText("Prestataire introuvable")).toBeVisible();
  });

  test("should show login error on wrong credentials", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel("Email").fill("wrong@test.sn");
    await page.getByLabel("Mot de passe").fill("WrongPass1");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page.getByText("Erreur de connexion")).toBeVisible();
  });
});
