import { CartResponse } from "@/types/cart.types";
import { ProductCart } from "@/types/product.types";
import { apiClient } from "./axios.config";

export class CartService {
  private static readonly ENDPOINT = "/cart";
  static async mergeCart(localCart: ProductCart[]): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>(
      `${this.ENDPOINT}/merge`,
      {
        items: localCart,
      },
    );

    return response.data;
  }
}
