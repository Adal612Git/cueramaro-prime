import React from 'react';
import { PriceTag } from './PriceTag';
import { t } from '../i18n/es-MX';

export type Product = {
  id: string | number;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string | null;
  precioPorKg: number;
  disponible?: boolean;
};

export type ProductCardProps = {
  product: Product;
  onAdd: (id: Product['id']) => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const disponible = product.disponible ?? true;
  return (
    <li className="product-card">
      <div
        style={{
          height: 192,
          background: 'var(--color-gray100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4B5563',
          marginBottom: 8,
        }}
      >
        Imagen de {product.nombre}
      </div>
      <b>{product.nombre}</b>
      {product.descripcion && (
        <div style={{ fontSize: 14, color: '#4B5563' }}>{product.descripcion}</div>
      )}
      <PriceTag pricePerKg={product.precioPorKg} currency="MXN" size="md" emphasis />
      <div>
        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="kg"
          id={`kg-${product.id}`}
          disabled={!disponible}
        // >
        <button
          className="add-btn"
          title="Agregar al carrito"
          aria-label={`Agregar ${product.nombre} al carrito`}
          onClick={() => onAdd(product.id)}
          disabled={!disponible}
        >
          {t.agregar}
        </button>
        {!disponible && <span style={{ marginLeft: 8, color: '#D97706' }}>Agotado</span>}
      </div>
    </li>
  );
}

export function ProductCardSkeleton() {
  return (
    <li style={{ marginBottom: 8 }} aria-busy="true">
      <div style={{ width: 140, height: 16, background: '#D1D5DB', borderRadius: 4 }} />
      <div
        style={{ width: 100, height: 12, background: '#E5E7EB', borderRadius: 4, marginTop: 6 }}
      // >
      <div
        style={{ width: 120, height: 20, background: '#E5E7EB', borderRadius: 4, marginTop: 8 }}
      // >
    </li>
  );
}

export function ProductCardError({ message }: { message?: string }) {
  return (
    <li role="alert" style={{ color: '#DC2626', marginBottom: 8 }}>
      {message || 'No se pudo cargar el producto'}
    </li>
  );
}
