import {
  Product,
  ProductQueryParams,
  ProductsResponse,
} from "@/types/product.types";
import { apiClient } from "./axios.config";

export class ProductService {
  private static readonly ENDPOINT = "/products";

  static async getProducts(
    params?: ProductQueryParams,
  ): Promise<ProductsResponse> {
    const response = await apiClient.get(this.ENDPOINT, { params });

    return response.data;
  }

  static async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`${this.ENDPOINT}/${id}`);
    return response.data;
  }
}
