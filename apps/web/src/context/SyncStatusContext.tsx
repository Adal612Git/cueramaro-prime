import { createContext, useContext } from 'react';
import type { SyncBadgeProps } from '../components/SyncBadge';

type SyncStatusValue = {
  status: SyncBadgeProps['status'];
  lastSync?: string;
};

export const SyncStatusContext = createContext<SyncStatusValue>({ status: 'syncing' });

export const useSyncStatus = () => useContext(SyncStatusContext);
