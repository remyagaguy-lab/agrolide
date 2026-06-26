import { test, expect } from '@playwright/test';

test.describe('Flow Paiement Stripe', () => {
  test('Affiche le formulaire de don', async ({ page }) => {
    await page.goto('/nous-soutenir');
    await expect(page.getByRole('heading', { name: /Soutenir agrolide/i })).toBeVisible();
    
    // Le formulaire de don est présent
    await expect(page.getByText(/Choisissez un montant/i)).toBeVisible();
  });

  test('Permet de saisir un don et initier le checkout', async ({ page }) => {
    await page.goto('/nous-soutenir');
    
    await page.getByRole('button', { name: /Montant libre/i }).click();
    await page.getByPlaceholder(/Saisissez un montant/i).fill('5000');
    await page.fill('input[id="prenom"]', 'Donateur');
    await page.fill('input[id="nom"]', 'Test');
    await page.fill('input[id="email"]', 'donateur@test.com');
    
    const submitBtn = page.getByRole('button', { name: /Soutenir/i });
    await expect(submitBtn).toBeEnabled();
    
    // On ne clique pas vraiment pour ne pas appeler Stripe s'il n'y a pas de mock API réseau,
    // ou alors on intercepte la requête.
    await page.route('/api/fonds/don', async (route) => {
      await route.fulfill({ json: { url: 'https://checkout.stripe.com/test' } });
    });
    
    await submitBtn.click();
  });
});
