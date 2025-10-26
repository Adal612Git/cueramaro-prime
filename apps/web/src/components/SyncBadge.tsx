import { colors } from '../design/tokens';
import { copy } from '../i18n/es-MX';

type SyncBadgeProps = {
  status: 'online' | 'syncing' | 'offline' | 'degraded';
  lastSyncISO?: string;
  compact?: boolean;
};

const STATUS_STYLES: Record<SyncBadgeProps['status'], { bg: string; text: string; label: string }> = {
  online: { bg: colors.success, text: '#fff', label: copy.sync.online },
  syncing: { bg: colors.warning, text: '#fff', label: copy.sync.syncing },
  degraded: { bg: colors.warning, text: '#fff', label: copy.sync.degraded },
  offline: { bg: colors.danger, text: '#fff', label: copy.sync.offline },
};

export default function SyncBadge({ status, lastSyncISO, compact = false }: SyncBadgeProps) {
  const { bg, text, label } = STATUS_STYLES[status];
  const time = lastSyncISO ? new Date(lastSyncISO) : null;
  const formattedTime = time ? time.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <span
      className={`sync-badge ${compact ? 'sync-badge--compact' : ''} ${status}`.trim()}
      style={{ backgroundColor: bg, color: text }}
      aria-live="polite"
    >
      <span className="sync-badge__dot" aria-hidden="true" />
      <span>{label}</span>
      {!compact && formattedTime && <span className="sync-badge__time">· {formattedTime}</span>}
    </span>
  );
}

export type { SyncBadgeProps };
