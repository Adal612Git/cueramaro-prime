import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import AxeBuilder from '@axe-core/playwright';
import { gotoApp } from '../test-helpers';
import { recordAxeResult, writeLighthouseReport } from '../report-writer';

type LighthouseCategory = 'accessibility' | 'best-practices' | 'performance' | 'seo';

let lighthouseScores: Record<LighthouseCategory, number> | null = null;

async function ensureLighthouseScores() {
  if (lighthouseScores) return lighthouseScores;
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--disable-gpu'] });
  try {
    const result = await lighthouse('http://127.0.0.1:4173', {
      port: chrome.port,
      output: ['json', 'html'],
      onlyCategories: ['accessibility', 'best-practices', 'performance', 'seo'],
      disableStorageReset: true,
      logLevel: 'error',
    });
    const reports = Array.isArray(result.report) ? result.report : [result.report];
    const jsonReport = reports.find((entry) => entry.trim().startsWith('{')) ?? '';
    const htmlReport = reports.find((entry) => entry.trim().startsWith('<')) ?? '';
    await writeLighthouseReport(htmlReport, jsonReport);
    lighthouseScores = {
      accessibility: (result.lhr.categories.accessibility.score ?? 0) * 100,
      'best-practices': (result.lhr.categories['best-practices'].score ?? 0) * 100,
      performance: (result.lhr.categories.performance.score ?? 0) * 100,
      seo: (result.lhr.categories.seo.score ?? 0) * 100,
    };
    return lighthouseScores;
  } finally {
    await chrome.kill();
  }
}

test.describe('T5 — AA + Lighthouse', () => {
  test('lighthouse accessibility score >= 90', async () => {
    const scores = await ensureLighthouseScores();
    expect(scores.accessibility).toBeGreaterThanOrEqual(90);
  });

  test('lighthouse best-practices score >= 90', async () => {
    const scores = await ensureLighthouseScores();
    expect(scores['best-practices']).toBeGreaterThanOrEqual(90);
  });

  test('lighthouse performance score >= 90', async () => {
    const scores = await ensureLighthouseScores();
    expect(scores.performance).toBeGreaterThanOrEqual(90);
  });

  test('lighthouse seo score >= 90', async () => {
    const scores = await ensureLighthouseScores();
    expect(scores.seo).toBeGreaterThanOrEqual(90);
  });

  test('axe scan — home', async ({ page }) => {
    await gotoApp(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).length).toBe(0);
    await recordAxeResult('home', results);
  });

  test('axe scan — offline badge view', async ({ page, context }) => {
    await gotoApp(page);
    await context.setOffline(true);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).length).toBe(0);
    await recordAxeResult('offline', results);
  });

  test('axe scan — error banner', async ({ page }) => {
    await page.route('**/api/productos', async (route) => {
      await route.fulfill({ status: 500, body: 'error' });
    });
    await gotoApp(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).length).toBe(0);
    await recordAxeResult('error', results);
  });

  test('axe scan — cart drawer open', async ({ page }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    const results = await new AxeBuilder({ page }).include('.cart-drawer').analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).length).toBe(0);
    await recordAxeResult('cart', results);
  });

  test('axe scan — empty state', async ({ page }) => {
    await gotoApp(page, { products: [] });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).length).toBe(0);
    await recordAxeResult('empty', results);
  });

  test('screenshot — home', async ({ page }) => {
    await gotoApp(page);
    await fs.mkdir('docs/screenshots', { recursive: true });
    await page.screenshot({ path: 'docs/screenshots/home.png', fullPage: true });
  });

  test('screenshot — catalog grid', async ({ page }) => {
    await gotoApp(page);
    await fs.mkdir('docs/screenshots', { recursive: true });
    await page.locator('.catalog-grid').screenshot({ path: 'docs/screenshots/catalog.png' });
  });

  test('screenshot — cart drawer abierto', async ({ page }) => {
    await gotoApp(page);
    await page.getByRole('button', { name: 'Agregar' }).first().click();
    await page.getByRole('button', { name: /Abrir carrito/ }).click();
    await fs.mkdir('docs/screenshots', { recursive: true });
    await page.locator('.cart-drawer').screenshot({ path: 'docs/screenshots/cart.png' });
  });

  test('screenshot — estado offline', async ({ page, context }) => {
    await gotoApp(page);
    await context.setOffline(true);
    await fs.mkdir('docs/screenshots', { recursive: true });
    await page.screenshot({ path: 'docs/screenshots/offline.png', fullPage: true });
  });
});
