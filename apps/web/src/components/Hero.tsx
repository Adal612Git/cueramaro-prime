import React from 'react';
import { colors, spacing, type as typeScale, radius, shadow } from '../design/tokens';

export function Hero() {
  const onClick = () => {
    const el =
      document.getElementById('catalogo') ||
      (document.querySelector('section[aria-label="CatÃƒÂ¡logo"]') as HTMLElement | null);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <section
      aria-label="Hero Cortes premium"
      style={{
        background: `linear-gradient(90deg, ${colors.brand} 0%, ${colors.brand600} 100%)`,
        color: '#fff',
        padding: `${spacing['2xl']}px ${spacing.lg}px`,
        borderRadius: radius.md,
        boxShadow: shadow.card,
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
      }}
    >
      <h2 style={{ fontSize: typeScale.h1, fontWeight: 700, margin: 0 }}>Cortes premium</h2>
      <p style={{ marginTop: 6, opacity: 0.95 }}>La mejor carne directamente a tu mesa</p>
      <button
        onClick={onClick}
        style={{
          marginTop: spacing.md,
          background: '#fff',
          color: colors.brand,
          fontWeight: 700,
          padding: '10px 14px',
          borderRadius: radius.sm,
          border: `1px solid ${colors.gray300}`,
          cursor: 'pointer',
        }}
      >
        Ver CatÃƒÂ¡logo Completo
      </button>
    </section>
  );
}
