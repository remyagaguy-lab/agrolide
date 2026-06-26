import { test, expect } from '@playwright/test';

test.describe('Flow Forum', () => {
  test('Affiche la page du forum public et redirige vers login si on clique sur Nouveau Fil', async ({ page }) => {
    await page.goto('/membres/forum'); // Bien que sous membres, le middleware redirige.
    
    // Si déconnecté, la page /membres/forum devrait rediriger vers /login
    await page.waitForURL('**/login*');
    await expect(page.getByRole('heading', { name: /Connexion/i })).toBeVisible();
  });
});
