import { IRootState } from "@/store";
import { CartItem } from "@/types/cart.types";
import { useSelector } from "react-redux";

export function useCart() {
  const reduxCart = useSelector((state: IRootState) => state.cart);

  const items: CartItem[] = reduxCart.items;

  return {
    items,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: reduxCart.totalPrice,
  };
}
