import type { Product } from './useProducts';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/EmptyState';
import ErrorBanner from '../../components/ErrorBanner';
import { copy } from '../../i18n/es-MX';

export type CatalogGridProps = {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onAdd: (id: Product['id']) => void;
  hasProducts: boolean;
};

const skeletonArray = Array.from({ length: 4 }, (_, index) => index);

export default function CatalogGrid({
  products,
  isLoading,
  isError,
  onRetry,
  onAdd,
  hasProducts,
}: CatalogGridProps) {
  if (isError) {
    return <ErrorBanner message={copy.errorBanner} onRetry={onRetry} />;
  }

  if (isLoading) {
    return (
      <div className="catalog-grid" aria-live="polite" aria-busy="true">
        {skeletonArray.map((placeholder) => (
          <div key={placeholder} className="product-card skeleton" aria-hidden="true">
            <div className="product-card__image" />
            <div className="product-card__content">
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
              <div className="skeleton-footer">
                <div className="skeleton-line short" />
                <div className="skeleton-button" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!hasProducts) {
    return <EmptyState icon="🛒" message={copy.emptyProducts} />;
  }

  return (
    <div className="catalog-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
