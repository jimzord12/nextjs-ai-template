import { expect, test } from "@playwright/test";

test("404 page renders for non-existent routes", async ({ page }) => {
  const response = await page.goto("/en/nonexistent-page");

  // Should still render (Next.js serves the 404 page)
  expect(response).not.toBeNull();

  // 404 page content visible
  await expect(page.getByText("404")).toBeVisible();
  await expect(
    page.getByText(/page you requested does not exist/i),
  ).toBeVisible();

  // "Back to home" link present
  await expect(page.getByText("Back to home")).toBeVisible();
});
