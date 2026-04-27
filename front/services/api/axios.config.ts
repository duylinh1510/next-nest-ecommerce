import { store } from "@/store";
import axios from "axios";
import { authService } from "./auth.service";
import { clearAuth, setAccessToken } from "@/store/slices/authSlice";
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Mỗi lần sắp gửi request, code đọc Redux store lấy state.auth.accessToken.
// Nếu có token → tự thêm header Authorization: Bearer ....
// Nhờ vậy không cần ở từng API call nhớ lấy token thủ công (trừ vài trường hợp đặc biệt).
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  //Mọi response OK đi qua không đổi: (response) => response — trả về nguyên response cho code gọi API.
  (response) => response,
  //khi backend trả 401 (access token hết hạn / không hợp lệ), không bắt user gọi lại API bằng tay
  async (error) => {
    //giữ lại cấu hình request vừa thất bại (URL, method, body…).
    const originalRequest = error.config;
    //Chỉ xử lý 401 một lần cho cùng một request
    if (error.response?.status === 401 && !originalRequest._retry) {
      //lần đầu 401 thì đánh dấu _retry = true để tránh vòng lặp vô hạn (refresh cũng 401 thì không lặp mãi).
      originalRequest._retry = true;
      //Nếu còn refreshToken trong Redux
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      //Gọi authService.refreshToken(refreshToken) lấy access token mới.
      if (refreshToken) {
        const newAccessToken = await authService.refreshToken(refreshToken);

        //Nếu có token mới
        if (newAccessToken) {
          //cập nhật store, gắn lại Authorization trên cùng originalRequest
          store.dispatch(setAccessToken(newAccessToken));
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          //gửi lại request cũ với token mới.
          return apiClient(originalRequest);
        }
      }
      //Nếu không refresh được
      //xóa trạng thái đăng nhập.
      store.dispatch(clearAuth());
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
  },
);
