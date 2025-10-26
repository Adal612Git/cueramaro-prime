import React from 'react';
import { colors, shadow, radius } from '../design/tokens';

export function CartIconButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Abrir carrito: ${count} artÃƒÂ­culos`}
      title={`Carrito: ${count} artÃƒÂ­culos`}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 20,
        background: colors.brand,
        color: '#fff',
        border: 'none',
        width: 56,
        height: 56,
        borderRadius: 999,
        boxShadow: shadow.card,
        fontSize: 20,
        fontWeight: 700,
      }}
    >
      Ã°Å¸â€ºâ€™
      <span
        style={{
          position: 'absolute',
          top: -6,
          right: -6,
          background: '#111827',
          color: '#fff',
          borderRadius: radius.sm,
          padding: '2px 6px',
          fontSize: 12,
        }}
      >
        {count}
      </span>
    </button>
  );
}
