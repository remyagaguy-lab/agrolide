import { test, expect } from '@playwright/test';

test.describe('Flow Inscription', () => {
  test('Devrait pouvoir accéder à la page rejoindre et voir les options', async ({ page }) => {
    await page.goto('/rejoindre');
    await expect(page.getByText('Junior').first()).toBeVisible();
    await expect(page.getByText('Professionnel').first()).toBeVisible();
    await expect(page.getByText('Partenaire').first()).toBeVisible();
  });

  test('Devrait pouvoir remplir le formulaire Junior', async ({ page }) => {
    // Note: This test simulates the flow but doesn't actually hit real Supabase Auth
    // unless you mock it or use an isolated DB.
    await page.goto('/inscription?role=junior');
    
    await page.fill('input[name="prenom"]', 'Test');
    await page.fill('input[name="nom"]', 'Junior');
    await page.fill('input[name="email"]', 'test.junior@agrolide.org');
    await page.fill('input[name="password"]', 'Password123!');
    
    // Select country
    await page.selectOption('select[name="pays"]', 'Côte d\'Ivoire');
    await page.selectOption('select[name="specialite"]', { index: 1 });

    // Mots de motivation (Junior)
    const motsInput = page.locator('textarea[name="mots_motivation"]');
    if (await motsInput.isVisible()) {
      await motsInput.fill('Je souhaite apprendre.');
    }

    // Submit
    const submitBtn = page.getByRole('button', { name: /M'inscrire/i });
    if (await submitBtn.isVisible()) {
      // In a real isolated environment, we could click and wait for success.
      // await submitBtn.click();
      // await expect(page).toHaveURL(/.*membres\/dashboard/);
    }
  });
});
