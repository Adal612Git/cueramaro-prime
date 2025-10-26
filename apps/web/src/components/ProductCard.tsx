import PriceTag from './PriceTag';
import { copy } from '../i18n/es-MX';
import type { Product } from '../features/catalog/useProducts';

export type ProductCardProps = {
  product: Product;
  onAdd: (id: Product['id']) => void;
};

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const { id, nombre, descripcion, imagenUrl, precioPorKg, disponible = true } = product;

  const outOfStock = !disponible;

  return (
    <article className={`product-card${outOfStock ? ' product-card--disabled' : ''}`}>
      <div className="product-card__image" aria-hidden={Boolean(imagenUrl)}>
        {imagenUrl ? (
          <img src={imagenUrl} alt={nombre} loading="lazy" />
        ) : (
          <span>Imagen de {nombre}</span>
        )}
      </div>
      <div className="product-card__content">
        <header>
          <h3 className="product-card__title">{nombre}</h3>
          {descripcion && <p className="product-card__description">{descripcion}</p>}
        </header>
        <footer className="product-card__footer">
          <PriceTag pricePerKg={precioPorKg} emphasis size="lg" />
          <button
            type="button"
            className="product-card__add"
            onClick={() => onAdd(id)}
            disabled={outOfStock}
            aria-label={`Agregar ${nombre} al carrito`}
          >
            {copy.add}
          </button>
        </footer>
      </div>
    </article>
  );
}
