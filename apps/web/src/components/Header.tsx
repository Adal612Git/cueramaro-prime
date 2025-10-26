import SyncBadge from './SyncBadge';
import type { SyncBadgeProps } from './SyncBadge';
import CartIconButton from './CartIconButton';

export type HeaderProps = {
  version: string;
  apiUrl: string;
  syncStatus: SyncBadgeProps['status'];
  lastSync?: string;
  cartCount: number;
  onCartClick: () => void;
};

export default function Header({ version, apiUrl, syncStatus, lastSync, cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="app-header" role="banner">
      <div className="app-header__brand">
        <span aria-hidden="true" className="app-header__emoji">
          🥩
        </span>
        <div>
          <strong className="app-header__title">Cuerámaro Prime</strong>
          <span className="app-header__meta">v{version} · API: {apiUrl}</span>
        </div>
      </div>
      <div className="app-header__actions">
        <SyncBadge status={syncStatus} lastSyncISO={lastSync} />
        <CartIconButton count={cartCount} onClick={onCartClick} />
      </div>
    </header>
  );
}
