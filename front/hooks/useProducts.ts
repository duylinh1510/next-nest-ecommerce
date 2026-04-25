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

  const [product, setProduct] = useState<Product | null>(null);
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

  const getProduct = useCallback(
    async (id: string): Promise<Product | null> => {
      if (!id) return null;
      setIsLoading(true);
      setError(null);

      try {
        const response = await ProductService.getProductById(id);

        if (response) {
          setProduct(response);
          return response;
        }

        throw new Error("Product not found");
      } catch (error) {
        const message = "Failed to load product: " + error;
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );
  return { isLoading, products, getProducts, error, meta, getProduct, product };
}
