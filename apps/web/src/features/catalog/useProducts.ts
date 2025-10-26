import { useQuery } from '@tanstack/react-query';
import { getJSON } from '../../lib/api';

export type Product = {
  id: string | number;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string | null;
  precioPorKg: number;
  disponible?: boolean;
};

type ProductsResponse = Product[];

export function useProducts() {
  const query = useQuery<ProductsResponse, Error>({
    queryKey: ['productos'],
    queryFn: () => getJSON<ProductsResponse>('/productos'),
    staleTime: 1000 * 60,
  });

  const products = query.data ?? [];

  const availableProducts = products.filter((product) => product.disponible !== false);

  return {
    ...query,
    products: availableProducts,
    hasProducts: availableProducts.length > 0,
  };
}
