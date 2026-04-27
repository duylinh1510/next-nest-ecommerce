export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: string;
}

export interface Order {
  id: string;
  userId: string;
  cartItems: OrderItem[];
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subTotal: number;
  createdAt: string;
  updatedAt: string;
}
export interface UserOrder {
  id: string;
  userId: string;
  status: string;
  total: number;
  shippingAddress: string;
  items: OrderLineItem[];
  createdAt: string;
  updatedAt: string;
}
export interface PaginatedOrdersResponse {
  data: UserOrder[];
  total: number; // tổng số bản ghi (để tính số trang)
  page: number;
  limit: number;
}

export interface SingleOrderApiResponse {
  success: boolean;
  message: string;
  data: UserOrder;
}
