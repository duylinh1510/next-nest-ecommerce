import { IRootState } from "@/store";
import { CartItem } from "@/types/cart.types";
import { Product } from "@/types/product.types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartAction } from "@/store/slices/cartSlice";

export function useCart() {
  const reduxCart = useSelector((state: IRootState) => state.cart);

  const items: CartItem[] = reduxCart.items;
  const dispatch = useDispatch();

  const addProductToCart = async (product: Product) => {
    dispatch(addToCartAction(product));
  };
  return {
    items,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: reduxCart.totalPrice,
    addProductToCart,
  };
}
