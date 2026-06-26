import { test, expect } from '@playwright/test';

test.describe('Vérification SEO', () => {
  const routes = [
    { path: '/', title: 'Accueil | agrolide' },
    { path: '/qui-sommes-nous', title: 'Qui sommes-nous | agrolide' },
    { path: '/rejoindre', title: 'Rejoindre le réseau | agrolide' },
  ];

  for (const route of routes) {
    test(`Vérifier les balises SEO sur ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveTitle(route.title);
      
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.*/);
    });
  }
});
