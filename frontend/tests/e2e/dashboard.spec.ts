import { test, expect } from "@playwright/test";
import { registerUser, authHeaders } from "./helpers";

test.describe("Dashboard", () => {
  test("should redirect unauthenticated users to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("should show professional dashboard after login", async ({ page, request }) => {
    const { accessToken, user } = await registerUser(request, "PROFESSIONAL");
    const email = user.email;
    const password = "Test@1234";

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    await expect(page.getByText("Espace professionnel")).toBeVisible();
    await expect(page.getByText("Modifier mon profil →")).toBeVisible();
  });

  test("should show client dashboard after login", async ({ page, request }) => {
    const { user } = await registerUser(request, "CLIENT");
    const email = user.email;
    const password = "Test@1234";

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    await expect(page.getByText("Espace client")).toBeVisible();
    await expect(page.getByText("Votre espace client sera bientôt disponible.")).toBeVisible();
  });

  test("should navigate to edit profile page", async ({ page, request }) => {
    const { accessToken, user } = await registerUser(request, "PROFESSIONAL");
    const email = user.email;
    const password = "Test@1234";

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    await page.getByText("Modifier mon profil →").click();
    await expect(page).toHaveURL(/\/dashboard\/edit/);
  });

  test("should display create profile button when no profile exists", async ({ page, request }) => {
    const { user } = await registerUser(request, "PROFESSIONAL");
    const email = user.email;
    const password = "Test@1234";

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    await expect(page.getByText("Vous n'avez pas encore de profil professionnel")).toBeVisible();
    await expect(page.getByText("Créer mon profil")).toBeVisible();
  });

  test("should allow logout", async ({ page, request }) => {
    const { user } = await registerUser(request, "CLIENT");
    const email = user.email;
    const password = "Test@1234";

    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    await page.getByText("Déconnexion").click();
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Connexion")).toBeVisible();
  });
});
