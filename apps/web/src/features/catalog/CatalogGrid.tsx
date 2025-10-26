import React from 'react';
import type { Product as UIProduct } from '../../components/ProductCard';
import { ProductCard, ProductCardSkeleton } from '../../components/ProductCard';
import { t } from '../../i18n/es-MX';
import { ErrorBanner } from '../../components/ErrorBanner';
import { EmptyState } from '../../components/EmptyState';

export function CatalogGrid({
  products,
  onAdd,
  state,
  onRetry,
  error,
}: {
  products: UIProduct[];
  onAdd: (id: UIProduct['id']) => void;
  state?: 'idle' | 'loading' | 'ready' | 'empty' | 'error';
  onRetry?: () => void;
  error?: string;
}) {
  return (
    <section id="catalogo" aria-label="CatÃƒÂ¡logo">
      <h2>{t.productos}</h2>
      {state === 'empty' && <EmptyState title={t.vacio} />}
      {state === 'error' && (
        <>
          <ErrorBanner message={error || ''} />
          {onRetry && (
            <button onClick={onRetry} style={{ marginTop: 8 }}>
              Intenta de nuevo
            </button>
          )}
        </>
      )}
      <ul className="catalog-grid">
        {state === 'loading'
          ? [0, 1, 2, 3].map((i) => <ProductCardSkeleton key={`s-${i}`} />)
          : products.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
      </ul>
    </section>
  );
}
