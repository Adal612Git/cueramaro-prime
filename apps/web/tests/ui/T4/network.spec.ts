import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { gotoApp } from '../test-helpers';

test.describe('T4 — Estados de red', () => {
  test('transitions from online to offline and back to online', async ({ page, context }) => {
    const timestamps = [
      { status: 'ok' as const, ts: '2024-01-01T12:00:00.000Z' },
      { status: 'ok' as const, ts: '2024-01-01T12:05:00.000Z' },
    ];
    await gotoApp(page, { healthSequence: timestamps });
    await expect(page.getByText('En línea')).toBeVisible();
    await context.setOffline(true);
    await expect(page.getByText('Sin conexión. Guardamos tus cambios y enviaremos tu pedido cuando vuelva la red.')).toBeVisible();
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await expect(page.getByText('En línea')).toBeVisible();
  });

  test('updates last sync timestamp when coming back online', async ({ page, context }) => {
    const timestamps = [
      { status: 'ok' as const, ts: '2024-01-01T08:00:00.000Z' },
      { status: 'ok' as const, ts: '2024-01-01T08:15:00.000Z' },
    ];
    await gotoApp(page, { healthSequence: timestamps });
    const badge = page.locator('.sync-badge');
    const initial = await badge.innerText();
    await context.setOffline(true);
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await expect(async () => {
      const current = await badge.innerText();
      expect(current).not.toEqual(initial);
    }).toPass();
  });

  test('catalog remains available in offline mode', async ({ page, context }) => {
    await gotoApp(page);
    await context.setOffline(true);
    await expect(page.locator('.product-card')).toHaveCount(2);
  });

  test('confirm button disables while offline', async ({ page, context }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await context.setOffline(true);
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    await expect(page.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled();
  });

  test('offline microcopy matches specification', async ({ page, context }) => {
    await gotoApp(page);
    await context.setOffline(true);
    await expect(page.getByText('Sin conexión. Guardamos tus cambios y enviaremos tu pedido cuando vuelva la red.')).toBeVisible();
  });

  test('axe scan passes in offline state', async ({ page, context }) => {
    await gotoApp(page);
    await context.setOffline(true);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).length).toBe(0);
  });

  test('sync badge snapshot — online', async ({ page }) => {
    await gotoApp(page);
    await expect(page.locator('.sync-badge')).toHaveScreenshot('t4-online.png');
  });

  test('sync badge snapshot — syncing', async ({ page }) => {
    await page.route('**/api/productos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
    await page.route('**/api/health', async (route) => {
      await page.waitForTimeout(1500);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'ok', ts: '2024-01-01T10:00:00.000Z' }),
      });
    });
    await page.goto('/');
    await expect(page.locator('.sync-badge')).toHaveText(/Sincronizando…/);
    await expect(page.locator('.sync-badge')).toHaveScreenshot('t4-syncing.png');
  });

  test('sync badge snapshot — degraded', async ({ page }) => {
    await gotoApp(page, { healthSequence: [{ status: 'degraded', ts: '2024-01-01T09:00:00.000Z' }] });
    await expect(page.locator('.sync-badge')).toHaveScreenshot('t4-degraded.png');
  });

  test('sync badge snapshot — offline', async ({ page, context }) => {
    await gotoApp(page);
    await context.setOffline(true);
    await expect(page.locator('.sync-badge')).toHaveScreenshot('t4-offline.png');
  });
});
