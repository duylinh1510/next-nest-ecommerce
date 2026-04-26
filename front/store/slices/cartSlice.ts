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
    /**
     * Giảm số lượng 1 dòng trong giỏ (payload = `product.id` của sản phẩm cần giảm).
     * - Tìm dòng có cùng `product.id`; không có thì không làm gì.
     * - Nếu `quantity` > 1: chỉ trừ 1.
     * - Nếu `quantity` <= 1: xóa hẳn dòng đó khỏi giỏ (coi như bỏ món).
     * Sau khi cập nhật `items`, tính lại `totalItems` và `totalPrice`.
     */
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload,
      );

      if (item) {
        if (item.quantity <= 1) {
          // Còn 1 (hoặc lỗi dữ liệu): gỡ dòng, không để quantity = 0
          state.items = state.items.filter(
            (item) => item.product.id !== action.payload,
          );
        } else {
          item.quantity -= 1;
        }

        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
      }
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload,
      );

      if (item) {
        item.quantity += 1;

        const total = calculateTotals(state.items);
        state.totalItems = total.totalItems;
        state.totalPrice = total.totalPrice;
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload,
      );

      if (item) {
        state.items = state.items.filter(
          (item) => item.product.id !== action.payload,
        );

        const total = calculateTotals(state.items);
        state.totalItems = total.totalItems;
        state.totalPrice = total.totalPrice;
      }
    },

    clearAllCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
    },
  },
});

// Action để dùng bên ngoài: addToCart(product), decrementQuantity(productId)
export const {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  clearAllCart,
} = cartSlice.actions;
// Reducer: import trong `combineReducers` ở `store/index.ts`
export default cartSlice.reducer;
