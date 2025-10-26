import type { Page } from '@playwright/test';
import type { Product } from '../../src/features/catalog/useProducts';

export const defaultProducts: Product[] = [
  {
    id: '1',
    nombre: 'Rib Eye',
    descripcion: 'Corte premium marmoleado',
    precioPorKg: 450,
    imagenUrl: null,
  },
  {
    id: '2',
    nombre: 'Arrachera',
    descripcion: 'Perfecta para asar',
    precioPorKg: 380,
    imagenUrl: null,
  },
];

export type HealthStatus = 'ok' | 'offline' | 'syncing' | 'degraded' | 'error';

export type HealthPayload = { status: 'ok' | 'degraded' | 'error'; ts: string };

export function createHealthSequence(sequence: HealthPayload[]) {
  let index = 0;
  return () => {
    const value = sequence[Math.min(index, sequence.length - 1)];
    index += 1;
    return value;
  };
}

export async function stubApis(page: Page, options?: { products?: Product[]; healthSequence?: HealthPayload[]; ventasStatus?: number }) {
  const products = options?.products ?? defaultProducts;
  const healthSequence = options?.healthSequence ?? [
    { status: 'ok', ts: new Date().toISOString() },
  ];
  const nextHealth = createHealthSequence(healthSequence);

  await page.route('**/api/productos', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(products),
    });
  });

  await page.route('**/api/health', async (route) => {
    const payload = nextHealth();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(payload),
    });
  });

  await page.route('**/api/ventas', async (route) => {
    await route.fulfill({
      status: options?.ventasStatus ?? 201,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });
}

export async function gotoApp(page: Page, options?: Parameters<typeof stubApis>[1]) {
  await stubApis(page, options);
  await page.goto('/');
}
