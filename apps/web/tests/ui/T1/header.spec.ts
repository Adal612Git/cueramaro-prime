import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { gotoApp } from '../test-helpers';

test.describe('T1 — Header + SyncBadge + CartIconButton', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
  });

  test('header remains visible after scrolling', async ({ page }) => {
    const header = page.locator('header');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 1500));
    const box = await header.boundingBox();
    expect(box?.y).toBeLessThanOrEqual(1);
  });

  test('keyboard focus reaches cart icon button', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /Abrir carrito \(0\)/ })).toBeFocused();
  });

  test('sync badge shows En línea when health is ok', async ({ page }) => {
    await expect(page.getByText('En línea')).toBeVisible();
  });

  test('sync badge shows offline message when connection drops', async ({ page, context }) => {
    await context.setOffline(true);
    await expect(page.getByText('Sin conexión. Guardamos tus cambios y enviaremos tu pedido cuando vuelva la red.')).toBeVisible({ timeout: 10_000 });
  });

  test('sync badge passes accessibility scan in offline state', async ({ page, context }) => {
    await context.setOffline(true);
    await expect(page.getByText('Sin conexión. Guardamos tus cambios y enviaremos tu pedido cuando vuelva la red.')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .include('.sync-badge')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).length).toBe(0);
  });

  test('cart counter starts at 0', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Abrir carrito \(0\)/ })).toBeVisible();
  });

  test('cart counter increments when adding a product', async ({ page }) => {
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await expect(page.getByRole('button', { name: /Abrir carrito \(1\)/ })).toBeVisible();
  });

  test('cart button has visible focus outline', async ({ page }) => {
    const cartButton = page.getByRole('button', { name: /Abrir carrito \(0\)/ });
    await cartButton.focus();
    const outlineStyle = await cartButton.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        outlineStyle: styles.outlineStyle,
        outlineWidth: styles.outlineWidth,
      };
    });
    expect(outlineStyle.outlineStyle).toBe('solid');
    expect(outlineStyle.outlineWidth).toBe('2px');
  });

  test('cart button exposes descriptive aria-label', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Abrir carrito (0)' })).toHaveAttribute('aria-label', 'Abrir carrito (0)');
  });

  test('header satisfies accessibility rules', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('header')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).length).toBe(0);
  });

  test('header visual regression', async ({ page }) => {
    await expect(page.locator('header')).toHaveScreenshot('t1-header.png');
  });

  test('cart button visual regression', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Abrir carrito \(0\)/ })).toHaveScreenshot('t1-cart-button.png');
  });
});
