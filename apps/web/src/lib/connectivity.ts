import { useEffect, useState } from 'react';
import { t } from '../i18n/es-MX';

export type NetStatus = 'online' | 'syncing' | 'offline' | 'degraded';

export function useConnectivity(healthCheck?: () => Promise<any>, pollMs: number = 2000) {
  const [status, setStatus] = useState<NetStatus>(
    typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline',
  );

  useEffect(() => {
    const onOnline = () => {
      setStatus('syncing');
      // breve periodo de sincronizaciÃƒÂ³n
      setTimeout(() => setStatus('online'), 2000);
    };
    const onOffline = () => setStatus('offline');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    if (!healthCheck) return;
    let cancelled = false;
    const tick = () => {
      healthCheck()
        .then((h) => {
          if (cancelled) return;
          const s = String(h?.status || '').toLowerCase();
          if (s === 'degraded') {
            setStatus('degraded');
          } else if (typeof navigator !== 'undefined' && navigator.onLine) {
            // Back to online if health ok and browser online
            setStatus((prev) => (prev === 'offline' ? prev : 'online'));
          }
        })
        .catch(() => {
          if (cancelled) return;
          // If fetch fails while browser says online, consider degraded; else offline
          if (typeof navigator !== 'undefined' && navigator.onLine) {
            setStatus('degraded');
          } else {
            setStatus('offline');
          }
        });
    };
    tick();
    const id = setInterval(tick, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [healthCheck, pollMs]);

  const message =
    status === 'online'
      ? t.net_online_msg
      : status === 'syncing'
        ? t.net_sync_msg
        : status === 'degraded'
          ? t.status_degraded
          : t.net_offline_msg;

  return { status, message };
}
