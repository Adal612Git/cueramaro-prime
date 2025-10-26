import React from 'react';
import { colors, spacing, type as typeScale } from '../design/tokens';
import { t } from '../i18n/es-MX';

export function Footer({ version }: { version: string }) {
  const year = new Date().getFullYear();
  return (
    <footer
      role="contentinfo"
      aria-label="Pie de pÃƒÂ¡gina"
      style={{
        marginTop: spacing.xl,
        padding: `${spacing.lg}px ${spacing.lg}px`,
        borderTop: `1px solid ${colors.gray300}`,
        background: '#fff',
        color: colors.gray600,
        fontSize: typeScale.small,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.lg,
          flexWrap: 'wrap',
        }}
      >
        <div>
          Ã‚Â© {year} {t.brand}
        </div>
        <div>Aviso legal Ã‚Â· VersiÃƒÂ³n {version}</div>
      </div>
    </footer>
  );
}
