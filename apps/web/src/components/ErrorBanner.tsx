import React from 'react';
import { colors, radius } from '../design/tokens';
import { t } from '../i18n/es-MX';

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      title={message}
      style={{
        background: colors.danger,
        color: '#fff',
        borderRadius: radius.sm,
        padding: 8,
        marginTop: 8,
      }}
    >
      {t.error_generic}
    </div>
  );
}
