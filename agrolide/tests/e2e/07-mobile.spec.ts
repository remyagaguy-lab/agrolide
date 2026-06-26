import { test, expect } from '@playwright/test';

test.describe('Navigation Mobile', () => {
  // Configured to run on mobile viewport by Playwright projects
  test('Affiche le menu hamburger et permet la navigation', async ({ page, isMobile }) => {
    // Ce test s'exécute seulement si on est sur un profil mobile
    test.skip(!isMobile, 'Uniquement pour profil mobile');
    
    await page.goto('/');
    
    const menuBtn = page.getByRole('button', { name: /Menu/i });
    await expect(menuBtn).toBeVisible();
    
    await menuBtn.click();
    
    // Vérifier que les liens du menu mobile apparaissent
    await expect(page.getByRole('link', { name: /Connexion/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Qui sommes-nous/i }).first()).toBeVisible();
  });
});
