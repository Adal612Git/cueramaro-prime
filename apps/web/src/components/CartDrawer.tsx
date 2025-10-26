import { useEffect, useMemo, useRef, useState } from 'react';
import { colors } from '../design/tokens';
import { trapFocus } from '../lib/a11y';
import PriceTag from './PriceTag';
import type { CartItem } from '../features/cart/cart.store';
import { copy } from '../i18n/es-MX';
import { useSyncStatus } from '../context/SyncStatusContext';

export type CartDrawerProps = {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (rowId: string) => void;
  onConfirm: () => void;
};

export default function CartDrawer({
  items,
  isOpen,
  onClose,
  onRemove,
  onConfirm,
}: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { status } = useSyncStatus();
  const [isSubmitting, setSubmitting] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.subtotal, 0),
    [items]
  );

  const disabled = status === 'offline' || items.length === 0 || isSubmitting;

  useEffect(() => {
    if (!isOpen) return;
    const cleanup = trapFocus(drawerRef);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    drawerRef.current?.focus();
    return () => {
      cleanup?.();
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <aside
      className="cart-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={copy.cartTitle}
      ref={drawerRef}
      tabIndex={-1}
    >
      <header className="cart-drawer__header">
        <h2>{copy.cartTitle}</h2>
        <button type="button" onClick={onClose} className="cart-drawer__close" aria-label="Cerrar carrito">
          ✕
        </button>
      </header>
      <div className="cart-drawer__content hide-scrollbar">
        {items.length === 0 ? (
          <p className="cart-drawer__empty" aria-live="polite">
            {copy.cartEmpty}
          </p>
        ) : (
          <ul className="cart-drawer__list">
            {items.map((item) => (
              <li key={item.id} className="cart-drawer__item">
                <div>
                  <p className="cart-drawer__item-name">{item.nombre}</p>
                  <p className="cart-drawer__item-price">
                    <PriceTag pricePerKg={item.precioPorKg} size="sm" /> · {item.cantidadKg.toFixed(2)} kg
                  </p>
                </div>
                <div className="cart-drawer__actions">
                  <span className="cart-drawer__subtotal">${item.subtotal.toFixed(2)}</span>
                  <button
                    type="button"
                    className="cart-drawer__remove"
                    onClick={() => onRemove(item.id)}
                    aria-label={`${copy.removeItem} ${item.nombre}`}
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <footer className="cart-drawer__footer">
        <div className="cart-drawer__total">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        {status === 'offline' && (
          <p className="cart-drawer__offline" style={{ color: colors.danger }}>
            {copy.offlineConfirmHint}
          </p>
        )}
        <button
          type="button"
          className="cart-drawer__confirm"
          onClick={async () => {
            if (disabled) return;
            try {
              setSubmitting(true);
              await Promise.resolve(onConfirm());
            } finally {
              setSubmitting(false);
            }
          }}
          disabled={disabled}
        >
          {isSubmitting ? 'Enviando…' : copy.confirm}
        </button>
      </footer>
    </aside>
  );
}
