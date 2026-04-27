import {
  CreateOrderRequest,
  OrderResponse,
  PaginatedOrdersResponse,
  SingleOrderApiResponse,
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
  getOrderById: async (id: string): Promise<SingleOrderApiResponse> => {
    const response = await apiClient.get<SingleOrderApiResponse>(
      `/orders/${id}`,
    );
    return response.data;
  },
  cancelOrder: async (id: string): Promise<SingleOrderApiResponse> => {
    const response = await apiClient.delete<SingleOrderApiResponse>(
      `/orders/${id}`,
    );
    return response.data;
  },
};
