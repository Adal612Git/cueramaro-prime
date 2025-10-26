import { useCallback, useEffect, useMemo, useState } from 'react';
import './index.css';
import './App.css';
import Header from './components/Header';
import CatalogGrid from './features/catalog/CatalogGrid';
import { useProducts } from './features/catalog/useProducts';
import { useCartStore } from './features/cart/cart.store';
import CartDrawer from './components/CartDrawer';
import { copy } from './i18n/es-MX';
import { getJSON, postJSON } from './lib/api';
import type { SyncBadgeProps } from './components/SyncBadge';
import { SyncStatusContext } from './context/SyncStatusContext';

const VERSION = '1.0.0';
const API_URL = '/api';

type HealthResponse = { status: 'ok' | 'degraded' | 'error'; ts: string };

export default function App() {
  const { products, isLoading, isError, refetch, hasProducts } = useProducts();
  const { items, total, addItem, removeItem, clear } = useCartStore((state) => ({
    items: state.items,
    total: state.total,
    addItem: state.addItem,
    removeItem: state.removeItem,
    clear: state.clear,
  }));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncBadgeProps['status']>('syncing');
  const [lastSync, setLastSync] = useState<string | undefined>();

  const handleAddProduct = useCallback(
    (id: string | number) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      addItem({
        productId: product.id,
        nombre: product.nombre,
        precioPorKg: product.precioPorKg,
        cantidadKg: 1,
      });
    },
    [addItem, products]
  );

  const pollHealth = useCallback(async () => {
    try {
      setSyncStatus((status) => (status === 'offline' ? 'syncing' : status));
      const result = await getJSON<HealthResponse>('/health');
      setLastSync(result.ts);
      if (result.status === 'ok') {
        setSyncStatus('online');
      } else if (result.status === 'degraded') {
        setSyncStatus('degraded');
      } else {
        setSyncStatus('offline');
      }
    } catch (error) {
      setSyncStatus('offline');
    }
  }, []);

  useEffect(() => {
    pollHealth();
    const interval = window.setInterval(pollHealth, 20000);
    const handleOnline = () => pollHealth();
    const handleOffline = () => setSyncStatus('offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pollHealth]);

  useEffect(() => {
    if (syncStatus === 'offline') {
      setDrawerOpen(true);
    }
  }, [syncStatus]);

  const totalItems = items.length;

  const heroDescription = useMemo(
    () => `${copy.heroSubtitle}`,
    []
  );

  const handleConfirm = useCallback(async () => {
    if (syncStatus === 'offline' || items.length === 0) return;

    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        cantidadKg: item.cantidadKg,
        precioPorKg: item.precioPorKg,
      })),
      total,
      source: 'web',
    };

    await postJSON<typeof payload, { ok: boolean }>('/ventas', payload).catch(() => {
      // Mantener UX consistente; errores se pueden manejar mostrando banner en futuras iteraciones
    });
    clear();
    setDrawerOpen(false);
  }, [clear, items, syncStatus, total]);

  return (
    <SyncStatusContext.Provider value={{ status: syncStatus, lastSync }}>
      <div className="app-shell">
        <Header
          version={VERSION}
          apiUrl={API_URL}
          syncStatus={syncStatus}
          lastSync={lastSync}
          cartCount={totalItems}
          onCartClick={() => setDrawerOpen(true)}
        />

        <section className="hero" aria-labelledby="hero-heading">
          <h1 id="hero-heading" className="hero__title">
            {copy.heroTitle}
          </h1>
          <p className="hero__subtitle">{heroDescription}</p>
          <button type="button" className="hero__cta" onClick={() => {
            const catalog = document.getElementById('catalog-section');
            catalog?.scrollIntoView({ behavior: 'smooth' });
          }}>
            {copy.heroCta}
          </button>
        </section>

        <main id="catalog-section" role="main" aria-live="polite">
          <div className="catalog-header">
            <h2 className="catalog-title">Catálogo</h2>
            <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
              {syncStatus === 'offline' ? copy.sync.offline : copy.sync.online}
            </p>
          </div>

          <CatalogGrid
            products={products}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            onAdd={handleAddProduct}
            hasProducts={hasProducts}
          />
        </main>

        <button
          type="button"
          className="cart-fab"
          onClick={() => setDrawerOpen(true)}
          aria-label={`Abrir carrito (${totalItems})`}
        >
          🛒 {copy.cartTitle} ({totalItems})
        </button>

        <CartDrawer
          items={items}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onRemove={removeItem}
          onConfirm={handleConfirm}
        />

        <footer className="footer" role="contentinfo">
          Sistema Cuerámaro Prime · versión {VERSION}
        </footer>
      </div>
    </SyncStatusContext.Provider>
  );
}
