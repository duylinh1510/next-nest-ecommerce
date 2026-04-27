import { PaymentService } from "@/services/api/payment.service";
import {
  ConfirmPaymentRequest,
  CreatePaymentIntentRequest,
} from "@/types/payment.types";
import { useCallback, useState } from "react";

export function usePayment() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const createPaymentIntent = useCallback(
    async (data: CreatePaymentIntentRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await PaymentService.createPaymentIntent(data);
        if (response.success && response.data) {
          setClientSecret(response.data.clientSecret);
          setPaymentId(response.data.paymentId);

          return true;
        }

        throw new Error(response.message || "Failed to create payment");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create payment intent";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const confirmPayment = useCallback(
    async (data: ConfirmPaymentRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await PaymentService.confirmPayment(data);
        if (response.success) {
          return true;
        }

        throw new Error(response.message || "Failed to confirm payment");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create payment intent";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );
  return {
    clientSecret,
    createPaymentIntent,
    confirmPayment,
  };
}
