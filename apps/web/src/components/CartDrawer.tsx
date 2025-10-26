import React from 'react';
import { t } from '../i18n/es-MX';

export type ProductRef = { id: string | number };
export type CartItem = {
  id: string;
  productId: ProductRef['id'];
  nombre: string;
  precioPorKg: number;
  cantidadKg: number;
  subtotal: number;
};

export type CartDrawerProps = {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (rowId: string) => void;
  onConfirm: () => void;
};

export function CartDrawer({ items, isOpen, onClose, onRemove, onConfirm }: CartDrawerProps) {
  if (!isOpen) return null;
  const total = items.reduce((s, it) => s + it.subtotal, 0);
  const isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;
  const disableConfirm = isOffline || items.length === 0;
  return (
    <aside className="cart-drawer" aria-label="Carrito">
      <h2>{t.carrito}</h2>
      {items.length === 0 ? (
        <p>{t.vacio}</p>
      ) : (
        <>
          <ul>
            {items.map((it) => (
              <li key={it.id}>
                {it.nombre} Ã¢â‚¬â€ ${it.precioPorKg}/kg Ã¢â‚¬â€ {it.cantidadKg} kg Ã‚Â· $
                {it.subtotal.toFixed(2)}
                <button onClick={() => onRemove(it.id)} aria-label={`Quitar ${it.nombre}`}>
                  Ãƒâ€”
                </button>
              </li>
            ))}
          </ul>
          <p style={{ fontWeight: 700, fontSize: 18 }}>Total: ${total.toFixed(2)}</p>
        </>
      )}
      <div style={{ marginTop: 8 }}>
        <button
          onClick={onConfirm}
          disabled={disableConfirm}
          aria-disabled={disableConfirm ? 'true' : 'false'}
          style={{
            background: '#16A34A',
            color: '#fff',
            padding: '10px 12px',
            border: 0,
            borderRadius: 6,
          }}
        >
          {t.confirmar_pedido}
        </button>
        {isOffline && items.length > 0 && (
          <div style={{ marginTop: 6, color: '#4B5563', fontSize: 14 }}>{t.offline_send_later}</div>
        )}
        <button onClick={onClose} style={{ marginLeft: 8 }}>
          Cerrar
        </button>
      </div>
    </aside>
  );
}
