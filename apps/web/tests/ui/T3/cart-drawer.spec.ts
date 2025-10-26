import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { gotoApp } from '../test-helpers';

test.describe('T3 — CartDrawer', () => {
  test('opens drawer when tapping cart button', async ({ page }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    await expect(page.getByRole('dialog', { name: 'Tu carrito' })).toBeVisible();
  });

  test('adding an item creates a row in the drawer', async ({ page }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    await expect(page.locator('.cart-drawer__item')).toHaveCount(1);
  });

  test('removing an item deletes the row', async ({ page }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    await page.getByRole('button', { name: /Quitar/ }).click();
    await expect(page.locator('.cart-drawer__item')).toHaveCount(0);
  });

  test('total equals sum of subtotals', async ({ page }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await page.getByRole('button', { name: 'Agregar' }).nth(1).click();
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    const subtotals = await page.locator('.cart-drawer__subtotal').allInnerTexts();
    const total = subtotals.reduce((acc, value) => acc + parseFloat(value.replace('$', '')), 0);
    const displayed = await page.locator('.cart-drawer__total strong').innerText();
    expect(parseFloat(displayed.replace('$', ''))).toBeCloseTo(total, 2);
  });

  test('Confirmar pedido disabled when offline', async ({ page, context }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await context.setOffline(true);
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    await expect(page.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled();
  });

  test('offline microcopy is visible when offline', async ({ page, context }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await context.setOffline(true);
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    await expect(page.getByText('Se enviará al volver la red')).toBeVisible();
  });

  test('remove buttons expose aria-labels', async ({ page }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    await expect(page.getByRole('button', { name: /Quitar/ })).toHaveAttribute('aria-label', /Quitar/);
  });

  test('focus wraps inside drawer', async ({ page }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    const closeButton = page.getByRole('button', { name: 'Cerrar carrito' });
    await closeButton.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Confirmar pedido' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(closeButton).toBeFocused();
  });

  test('cart drawer visual regression', async ({ page }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    await expect(page.locator('.cart-drawer')).toHaveScreenshot('t3-cart-drawer.png');
  });

  test('cart drawer accessibility', async ({ page }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    const results = await new AxeBuilder({ page }).include('.cart-drawer').analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).length).toBe(0);
  });
});
