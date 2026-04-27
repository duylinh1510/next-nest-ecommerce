import {
  ConfirmPaymentRequest,
  CreatePaymentIntentRequest,
  PaymentResponse,
} from "@/types/payment.types";
import { apiClient } from "./axios.config";

export const PaymentService = {
  createPaymentIntent: async (
    data: CreatePaymentIntentRequest,
  ): Promise<PaymentResponse> => {
    const reponse = await apiClient.post<PaymentResponse>(
      "/payments/create-intent",
      data,
    );

    return reponse.data;
  },

  confirmPayment: async (
    data: ConfirmPaymentRequest,
  ): Promise<PaymentResponse> => {
    const reponse = await apiClient.post<PaymentResponse>(
      "/payments/confirm",
      data,
    );

    return reponse.data;
  },
};

export type {
  ConfirmPaymentRequest,
  CreatePaymentIntentRequest,
  PaymentResponse,
};
