import React from 'react';
import { colors, type as typeScale } from '../design/tokens';
import { t } from '../i18n/es-MX';

export type NetStatus = 'online' | 'syncing' | 'offline' | 'degraded';

export type SyncBadgeProps = {
  status: NetStatus;
  lastSyncISO?: string;
  compact?: boolean;
};

export function SyncBadge({ status, lastSyncISO, compact = false }: SyncBadgeProps) {
  const bg =
    status === 'online' ? colors.success : status === 'offline' ? colors.danger : colors.warning;
  const text =
    status === 'online'
      ? t.status_online
      : status === 'syncing'
        ? t.status_syncing
        : status === 'degraded'
          ? t.status_degraded
          : t.status_offline;
  const title = lastSyncISO ? `${text} Ã¢â‚¬Â¢ ÃƒÅ¡ltima sync: ${lastSyncISO}` : text;
  const padding = compact ? '4px 8px' : '6px 10px';
  const radius = compact ? 999 : 999;
  return (
    <span
      data-testid="net-badge"
      aria-label="Estado de red"
      title={title}
      style={{
        background: bg,
        color: '#fff',
        padding,
        borderRadius: radius,
        fontSize: typeScale.small,
        fontWeight: 600,
      }}
      className={status === 'syncing' ? 'syncing-anim' : undefined}
    >
      {text}
    </span>
  );
}
