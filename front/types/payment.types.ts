export interface CreatePaymentIntentRequest {
  orderId: string;
  amount: number;
  description?: string;
  currency?: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentId: string;
}

export interface PaymentResponse {
  success: boolean;
  data: CreatePaymentIntentResponse;
  message?: string;
}

export interface ConfirmPaymentRequest {
  orderId: string;
  paymentIntentId: string;
}
