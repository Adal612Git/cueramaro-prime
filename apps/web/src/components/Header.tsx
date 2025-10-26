import React from 'react';
import { colors, spacing, radius, type as typeScale } from '../design/tokens';
import { SyncBadge, NetStatus } from './SyncBadge';
import { srOnly, statusProps } from '../lib/a11y';
import { t } from '../i18n/es-MX';

export type HeaderProps = { version: string; apiUrl: string; syncStatus: NetStatus };

export function Header({ version, apiUrl, syncStatus }: HeaderProps) {
  return (
    <header
      role="banner"
      aria-label="Encabezado de CuerÃƒÂ¡maro Prime"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        paddingLeft: spacing.lg,
        paddingRight: spacing.lg,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <div
          aria-label="Marca"
          style={{ color: colors.ink, fontSize: typeScale.h3, fontWeight: 700 }}
        >
          {t.brand}
        </div>
        <span
          aria-label="versiÃƒÂ³n"
          style={{
            fontSize: typeScale.small,
            color: colors.gray600,
            border: `1px solid ${colors.gray300}`,
            borderRadius: radius.sm,
            padding: '2px 6px',
          }}
        >
          {version}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, justifySelf: 'end' }}>
        <SyncBadge status={syncStatus} compact />
      </div>

      <div data-testid="net-msg" style={srOnly} {...statusProps()}>
        {syncStatus === 'online'
          ? t.net_online_msg
          : syncStatus === 'syncing'
            ? t.net_sync_msg
            : syncStatus === 'degraded'
              ? t.status_degraded
              : t.net_offline_msg}
      </div>
    </header>
  );
}
