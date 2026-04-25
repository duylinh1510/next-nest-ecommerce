import { ProductService } from "@/services/api/product.service";
import {
  Product,
  ProductQueryParams,
  ProductsResponse,
} from "@/types/product.types";
import { useCallback, useState } from "react";

export function useProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const getProducts = useCallback(
    async (params?: ProductQueryParams): Promise<ProductsResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await ProductService.getProducts(params);
        setProducts(response.data);
        setMeta(response.meta);
        return response;
      } catch (error) {
        const message = "Failed to load products: " + error;
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, products, getProducts, error, meta };
}
