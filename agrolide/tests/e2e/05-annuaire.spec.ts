import { test, expect } from '@playwright/test';

test.describe('Flow Annuaire', () => {
  test('Affiche l\'annuaire public avec blur', async ({ page }) => {
    await page.goto('/annuaire');
    
    await expect(page.getByRole('heading', { name: /Le réseau des acteurs/i })).toBeVisible();
    
    // Le CTA pour rejoindre doit être présent au-dessus du blur
    await expect(page.getByRole('link', { name: /Devenir membre/i })).toBeVisible();
  });
});
