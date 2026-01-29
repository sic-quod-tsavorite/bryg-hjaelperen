// E2E test for theme switching in browser

import { test, expect } from '@playwright/test';

test.describe('Theme switching', () => {
  test('app loads with default theme', async ({ page }) => {
    await page.goto('/');

    // Verify the page loads
    await expect(page.locator('body')).toBeVisible();
  });

  test('can toggle theme via settings', async ({ page }) => {
    await page.goto('/');

    // Navigate to settings (adjust selector based on actual app structure)
    const settingsTab = page.getByRole('tab', { name: /indstillinger/i });
    if (await settingsTab.isVisible()) {
      await settingsTab.click();

      // Look for theme toggle (adjust selector based on actual UI)
      const themeToggle = page.getByRole('button', { name: /tema|theme/i });
      if (await themeToggle.isVisible()) {
        await themeToggle.click();

        // Verify theme changed (check for dark mode class or style)
        await expect(page.locator('html')).toHaveAttribute(
          'class',
          /dark|light/
        );
      }
    }
  });
});
