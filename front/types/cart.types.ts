import { Product } from "./product.types";

export interface CartItemType {
  product: Product;
  quantity: number;
  price: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  price: number;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
