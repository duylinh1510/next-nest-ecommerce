import { IRootState } from "@/store";
import { CartItem } from "@/types/cart.types";
import { Product } from "@/types/product.types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartAction } from "@/store/slices/cartSlice";
import { decrementQuantity as decrementQuantityAction } from "@/store/slices/cartSlice";
import { incrementQuantity as incrementQuantityAction } from "@/store/slices/cartSlice";
import { removeFromCart as removeFromCartAction } from "@/store/slices/cartSlice";
import { clearAllCart as clearAllCartAction } from "@/store/slices/cartSlice";

export function useCart() {
  const reduxCart = useSelector((state: IRootState) => state.cart);

  const items: CartItem[] = reduxCart.items;
  const dispatch = useDispatch();

  const addProductToCart = async (product: Product) => {
    dispatch(addToCartAction(product));
  };

  const decrementProductQuantity = async (productId: string) => {
    dispatch(decrementQuantityAction(productId));
  };

  const incrementProductQuantity = async (productId: string) => {
    dispatch(incrementQuantityAction(productId));
  };

  const removeProductFromCart = async (productId: string) => {
    dispatch(removeFromCartAction(productId));
  };

  const clearAllCart = async () => {
    dispatch(clearAllCartAction());
  };

  return {
    items,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: reduxCart.totalPrice,
    addProductToCart,
    decrementProductQuantity,
    incrementProductQuantity,
    removeProductFromCart,
    clearAllCart,
  };
}
