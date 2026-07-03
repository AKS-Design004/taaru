import { test, expect } from "@playwright/test";

test.describe("Providers", () => {
  test("should display providers page", async ({ page }) => {
    await page.goto("/providers");
    await expect(page.getByText("Découvrez les meilleurs professionnels près de chez vous")).toBeVisible();
  });

  test("should have a search bar", async ({ page }) => {
    await page.goto("/providers");
    await expect(
      page.getByPlaceholder("Rechercher par nom, ville, catégorie...")
    ).toBeVisible();
  });

  test("should show not-found for invalid provider", async ({ page }) => {
    await page.goto("/providers/00000000-0000-0000-0000-000000000000");
    await expect(page.getByText("Prestataire introuvable")).toBeVisible();
  });
});
