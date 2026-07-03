import { test, expect } from "@playwright/test";

const uniqueId = Date.now().toString(36);
const email = `e2e_auth_${uniqueId}@taaru.sn`;
const password = "Test@1234";

test.describe("Authentication", () => {
  test.describe("Registration", () => {
    test("should register a new professional user via UI", async ({ page }) => {
      await page.goto("/auth/register");

      await page.getByLabel("Prénom").fill("Aminata");
      await page.getByLabel("Nom").fill("Test");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Mot de passe").fill(password);
      await page.getByLabel("Confirmer le mot de passe").fill(password);
      await page.getByLabel("Vous êtes").selectOption("PROFESSIONAL");

      await page.getByRole("button", { name: "Créer mon compte" }).click();

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
      await expect(page.getByText("Bonjour,")).toBeVisible();
    });

    test("should show validation error on password mismatch", async ({ page }) => {
      await page.goto("/auth/register");

      await page.getByLabel("Prénom").fill("Aminata");
      await page.getByLabel("Nom").fill("Test");
      await page.getByLabel("Email").fill(`fail_${uniqueId}@taaru.sn`);
      await page.getByLabel("Mot de passe").fill(password);
      await page.getByLabel("Confirmer le mot de passe").fill("Different1");
      await page.getByLabel("Vous êtes").selectOption("CLIENT");

      await page.getByRole("button", { name: "Créer mon compte" }).click();
      await expect(page.getByText("Les mots de passe ne correspondent pas")).toBeVisible();
    });
  });

  test.describe("Login", () => {
    test("should login with valid credentials", async ({ page }) => {
      await page.goto("/auth/login");

      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Mot de passe").fill(password);

      await page.getByRole("button", { name: "Se connecter" }).click();

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
      await expect(page.getByText("Bonjour,")).toBeVisible();
    });

    test("should show error on invalid credentials", async ({ page }) => {
      await page.goto("/auth/login");

      await page.getByLabel("Email").fill("wrong@taaru.sn");
      await page.getByLabel("Mot de passe").fill("WrongPass1");

      await page.getByRole("button", { name: "Se connecter" }).click();
      await expect(page.getByText("Erreur de connexion")).toBeVisible();
    });

    test("should navigate to register from login page", async ({ page }) => {
      await page.goto("/auth/login");
      await page.getByText("S'inscrire").click();
      await expect(page).toHaveURL(/\/auth\/register/);
    });

    test("should navigate to login from register page", async ({ page }) => {
      await page.goto("/auth/register");
      await page.getByText("Se connecter").first().click();
      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });
});
