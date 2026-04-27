/**
 * File này là “trung tâm trạng thái” của app React/Next: nó tạo ra store (kho) để cả ứng dụng cùng đọc/ghi dữ liệu dùng chung, thay vì mỗi component tự cất riêng.
 * Cấu hình Redux store (RTK) + redux-persist.
 * - Giữ dữ liệu Redux qua lần tải lại trang (localStorage) thay vì mất hết mỗi lần F5.
 * - Next.js: trên server không có `window`/localStorage → dùng storage "giả" (noop) khi SSR; trên trình duyệt dùng localStorage thật.
 * - Thêm slice: khai báo trong `combineReducers`; cần lưu ổ đĩa thì thêm tên slice vào `whitelist` trong `persistConfig`.
 */
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import { persistReducer } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import { useDispatch } from "react-redux";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

// Trên server: không lưu được → luôn trả rỗng, tránh lỗi khi build/SSR dùng store
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(value: string) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// Client: lưu trong localStorage; Server: dùng noop ở trên
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root", // Tên key trong localStorage
  storage,
  whitelist: ["cart", "auth"], // Tên slice được ghi xuống ổ
};

// Gộp reducers: thêm slice ở đây
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

// Bọc reducer bằng persist để có khả năng lưu/đọc từ storage
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist gửi action có payload phức tạp; bỏ qua check "serializable" cho các action này
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Kiểu dispatch có thunk/async (khi cần)
export type AppDispatch = typeof store.dispatch;
// Dùng với <PersistGate> nếu muốn đợi rehydrate trước khi render app
export const persistor = persistStore(store);
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type IRootState = ReturnType<typeof store.getState>;
