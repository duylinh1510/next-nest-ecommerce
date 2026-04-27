import {
  CreateOrderRequest,
  OrderResponse,
  PaginatedOrdersResponse,
} from "@/types/orders.types";
import { apiClient } from "./axios.config";

export const OrderService = {
  createOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    const response = await apiClient.post<OrderResponse>("/orders", data);
    return response.data;
  },
  getMyOrders: async (params: {
    limit: number;
    page: string;
    status?: string;
  }): Promise<PaginatedOrdersResponse> => {
    const response = await apiClient.get<PaginatedOrdersResponse>("/orders", {
      params, // gửi ?page=&limit= lên (đồng bộ với Swagger)
    });
    return response.data;
  },
};
