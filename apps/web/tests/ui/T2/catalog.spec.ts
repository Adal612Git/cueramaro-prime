import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { gotoApp, defaultProducts } from '../test-helpers';

test.describe('T2 — CatalogGrid + ProductCard + PriceTag', () => {
  test('skeleton shows four placeholders while loading', async ({ page }) => {
    await page.route('**/api/productos', async (route) => {
      await page.waitForTimeout(500);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(defaultProducts),
      });
    });
    await gotoApp(page, { healthSequence: [{ status: 'ok', ts: new Date().toISOString() }] });
    const skeletons = page.locator('.product-card.skeleton');
    await expect(skeletons).toHaveCount(4);
  });

  test('renders product cards on success', async ({ page }) => {
    await gotoApp(page);
    await expect(page.locator('.product-card')).toHaveCount(defaultProducts.length);
  });

  test('Agregar button is clickable', async ({ page }) => {
    await gotoApp(page);
    const addButton = page.getByRole('button', { name: 'Agregar' }).first();
    await expect(addButton).toBeEnabled();
    await addButton.click();
    await expect(page.getByRole('button', { name: /Abrir carrito \(1\)/ })).toBeVisible();
  });

  test('PriceTag shows value in $XXX/kg format', async ({ page }) => {
    await gotoApp(page);
    const priceText = await page.locator('.product-card .price-tag').first().innerText();
    expect(priceText).toMatch(/\$\d+(,\d{3})*\/kg/);
  });

  test('displays EmptyState when API returns empty array', async ({ page }) => {
    await gotoApp(page, { products: [] });
    await expect(page.getByText('Aún no hay productos disponibles')).toBeVisible();
  });

  test('shows ErrorBanner when API fails', async ({ page }) => {
    await page.route('**/api/productos', async (route) => {
      await route.fulfill({ status: 500, body: 'error' });
    });
    await gotoApp(page);
    await expect(page.getByText('Algo salió mal. Intenta de nuevo.')).toBeVisible();
  });

  test('keyboard navigation reaches first product card add button', async ({ page }) => {
    await gotoApp(page);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Agregar' }).first()).toBeFocused();
  });

  test('hover elevates product card shadow', async ({ page }) => {
    await gotoApp(page);
    const card = page.locator('.product-card').first();
    const before = await card.evaluate((element) => getComputedStyle(element).boxShadow);
    await card.hover();
    const after = await card.evaluate((element) => getComputedStyle(element).boxShadow);
    expect(after).not.toEqual(before);
  });

  test('catalog grid passes accessibility scan', async ({ page }) => {
    await gotoApp(page);
    const results = await new AxeBuilder({ page }).include('.catalog-grid').analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).length).toBe(0);
  });

  test('product card visual regression', async ({ page }) => {
    await gotoApp(page);
    await expect(page.locator('.product-card').first()).toHaveScreenshot('t2-product-card.png');
  });
});
