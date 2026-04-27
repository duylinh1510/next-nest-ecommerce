import { Category } from "./category.types";

export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string;
  category: string;
  categoryId: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  categoryId?: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export interface ProductCart {
  productId: string;
  quantity: number;
}
