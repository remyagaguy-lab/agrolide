import { test, expect } from '@playwright/test';

test.describe('Flow Admin', () => {
  test('Redirige vers login si non connecté', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });
});
