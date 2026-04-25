/**
 * Slice giỏ hàng (Redux Toolkit).
 * - Lưu danh sách sản phẩm user đã thêm, số lượng từng dòng, tổng số món, tổng tiền.
 * - Kết nối với store ở `store/index.ts` dưới key `cart`.
 * - Từ component/hook: `dispatch(addToCart(product))` với `product` kiểu `Product`.
 */
import { Product } from "@/types/product.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState } from "@/types/cart.types";

// Trạng thái ban đầu: giỏ rỗng, tổng = 0. Kiểu `CartState` giúp TypeScript biết `items` là mảng `CartItem[]`.
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );
  return { totalItems, totalPrice };
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Thêm 1 sản phẩm vào giỏ (payload = toàn bộ `Product` từ API/UI).
     * Nếu sản phẩm đã có trong giỏ (cùng `product.id`) thì chỉ tăng `quantity`, không tạo dòng mới.
     * Sau mỗi thay đổi, tính lại `totalItems` và `totalPrice` từ toàn bộ `items`.
     */
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          product: action.payload,
          quantity: 1,
          price: action.payload.price,
          id: crypto.randomUUID(),
          cartId: "",
          productId: action.payload.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      const totals = calculateTotals(state.items);
      // Tổng số lượng (cộng quantity mọi dòng)
      state.totalItems = totals.totalItems;
      // Tổng tiền: giá sản phẩm × số lượng từng dòng
      state.totalPrice = totals.totalPrice;
    },
  },
});

// Action để dùng bên ngoài: addToCart(product)
export const { addToCart } = cartSlice.actions;
// Reducer: import trong `combineReducers` ở `store/index.ts`
export default cartSlice.reducer;
