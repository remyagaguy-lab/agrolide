import { test, expect } from '@playwright/test';

test.describe('Flow Bibliothèque', () => {
  test('Affiche la bibliothèque publique avec filtres', async ({ page }) => {
    await page.goto('/bibliotheque');
    await expect(page.getByRole('heading', { name: /Bibliothèque/i }).first()).toBeVisible();
    // Vérifier la présence d'un bouton pour rejoindre
    await expect(page.getByRole('link', { name: /Devenir membre/i }).first()).toBeVisible();
  });
});
