import { CartService } from "@/services/api/cart.service";
import { OrderService } from "@/services/api/order.service";
import { IRootState } from "@/store";
import { CreateOrderRequest, Order, UserOrder } from "@/types/orders.types";
import { useCallback, useState } from "react";

// hook của React-Redux, mỗi lần state.cart.items thay đổi,
// component dùng useOrder sẽ re-render với dữ liệu mới.
import { useSelector } from "react-redux";

export default function useOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersMeta, setOrdersMeta] = useState<{
    total: number;
    page: number;
    limit: number;
  } | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [detailOrder, setDetailOrder] = useState<UserOrder | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // lấy danh sách sản phẩm trong giỏ từ Redux và gán vào biến guessCart
  const guessCart = useSelector((state: IRootState) => state.cart.items);

  const createOrder = useCallback(
    async (data: CreateOrderRequest): Promise<Order | null> => {
      setLoading(true);
      setError(null);

      try {
        if (guessCart.length > 0) {
          await CartService.mergeCart(
            guessCart.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
            })),
          );
        }
        const response = await OrderService.createOrder(data);
        if (response.data) {
          setOrder(response.data);
          return response.data;
        }

        throw new Error(response.message ?? "Failed to create order");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create payment intent";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [guessCart],
  );

  const getAllOrders = useCallback(
    async (params: {
      limit: number;
      page: string;
      status?: string;
    }): Promise<void> => {
      setListLoading(true);
      setListError(null);
      try {
        const res = await OrderService.getMyOrders(params);
        setOrders(res.data);
        setOrdersMeta({
          total: res.total,
          page: res.page,
          limit: res.limit,
        });
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load orders";
        setListError(message);
        setOrders([]);
        setOrdersMeta(null);
      } finally {
        setListLoading(false);
      }
    },
    [],
  );

  const getOrderById = useCallback(async (id: string): Promise<void> => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await OrderService.getOrderById(id);
      setDetailOrder(res.data);
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : "Failed to load order");
      setDetailOrder(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const cancelOrder = useCallback(async (id: string): Promise<boolean> => {
    setCancelLoading(true);
    setCancelError(null);
    try {
      await OrderService.cancelOrder(id);
      return true;
    } catch (e) {
      setCancelError(e instanceof Error ? e.message : "Failed to cancel order");
      return false;
    } finally {
      setCancelLoading(false);
    }
  }, []);

  return {
    order,
    error,
    loading,
    createOrder,
    orders,
    ordersMeta,
    listLoading,
    listError,
    getAllOrders,
    detailOrder,
    detailLoading,
    detailError,
    getOrderById,
    cancelOrder,
    cancelLoading,
    cancelError,
  };
}
