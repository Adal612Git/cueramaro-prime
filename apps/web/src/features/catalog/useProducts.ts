import { useCallback, useEffect, useState } from 'react';
import { fetchProductosUI, ProductES } from '../../lib/api';

export type CatalogState = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

export function useProducts() {
  const [products, setProducts] = useState<ProductES[]>([]);
  const [state, setState] = useState<CatalogState>('idle');
  const [error, setError] = useState<string>('');

  const load = useCallback(async () => {
    setState('loading');
    setError('');
    try {
      const p = await fetchProductosUI();
      setProducts(p);
      setState(p && p.length > 0 ? 'ready' : 'empty');
    } catch (e: any) {
      setError(String(e?.message || e));
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { products, state, error, retry: load };
}
