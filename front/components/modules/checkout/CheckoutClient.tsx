"use client";

import { useEffect, useState } from "react";
import styles from "./checkout.module.scss";
import CheckoutHeader from "./CheckoutHeader";
import CheckoutSteps from "./CheckoutSteps";
import PaymentMethodCard from "./PaymentMethodCard";
import { Check, CreditCard } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import {
  StripePaymentForm,
  StripePaymentProvider,
} from "./stripe-payment-form";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { OrderItem } from "@/types/orders.types";
import useOrder from "@/hooks/useOrder";
import { useAuth } from "@/hooks/useAuth";

type Step = 1 | 2 | 3;

export default function CheckoutClient() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const { totalPrice, items, clearAllCart } = useCart();
  const { clientSecret, confirmPayment, createPaymentIntent } = usePayment();
  const [orderId, setOrderId] = useState<string>("");
  const { isAuthenticated } = useAuth();
  const [shippingAddress, setShippingAddress] = useState("");

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPayment(method);
    setStripeError(null);
  };

  const { createOrder } = useOrder();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (items.length == 0 && !orderId) {
      router.push("/cart");
    }
  }, [orderId, items, router]);

  useEffect(() => {
    const createOrderAutomatically = async () => {
      if (selectedPayment && !orderId && !isCreatingOrder && !clientSecret) {
        setIsCreatingOrder(true);
        setStripeError(null);

        try {
          const cartItems: OrderItem[] = items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          }));

          const order = await createOrder({
            items: cartItems,
            shippingAddress,
          });

          if (!order) {
            throw new Error("Failed to create order");
          }

          setOrderId(order.id);
          sessionStorage.setItem("pendingOrderId", order.id);
          await clearAllCart();

          if (selectedPayment === "stripe") {
            const paymentCreated = await createPaymentIntent({
              orderId: order.id,
              amount: totalPrice,
              description: "Order payment for ecommerce purchase",
              currency: "usd",
            });

            if (!paymentCreated) {
              throw new Error("Failed to create payment intent");
            }
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to create payment intent";
          setStripeError(errorMessage);
          console.log("Order creation error:", error);
        } finally {
          setIsCreatingOrder(false);
        }
      }
    };
    createOrderAutomatically();
  }, [
    selectedPayment,
    orderId,
    isCreatingOrder,
    clientSecret,
    items,
    createOrder,
    createPaymentIntent,
    totalPrice,
    shippingAddress,
  ]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      setCurrentStep(3);
      const confirmed = await confirmPayment({
        orderId,
        paymentIntentId,
      });

      if (!confirmed) {
        throw new Error("Failed to confirm payment");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create confirm payment";
      setStripeError(errorMessage);
      return null;
    }
  };

  const handlePaymentError = async (error: string) => {
    setStripeError(error);
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingAddress.trim()) {
      setCurrentStep(2);
    }
  };

  return (
    <section className={styles.section}>
      {/* container */}
      <div className={styles.container}>
        <CheckoutHeader />
        <CheckoutSteps currentStep={currentStep} />
        <div className={styles.content}>
          {currentStep === 1 && (
            <div className={styles.stepContent}>
              <h2>Shipping Address</h2>
              <form
                onSubmit={handleShippingSubmit}
                className={styles.shippingForm}
              >
                <div className={styles.field}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    placeholder="John Doe"
                    required
                    disabled={false}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="address">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    placeholder="123 Main St, Ward 1, District 1"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      placeholder="Ho Chi Minh City"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      placeholder="Vietnam"
                      required
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.backBtn}
                    onClick={() => router.push("/cart")}
                  >
                    ← Back to cart
                  </button>
                  <button type="submit" className={styles.continueButton}>
                    Continue to Payment →
                  </button>
                </div>
              </form>
            </div>
          )}
          {currentStep === 2 && (
            <div className={styles.stepContent}>
              <h2>Select Payment Method</h2>
              <div className={styles.paymentMethods}>
                {/* stripe */}
                <PaymentMethodCard
                  method="stripe"
                  selectedMethod={selectedPayment}
                  onSelect={handlePaymentMethodSelect}
                  icon={<CreditCard />}
                  title="Credit / Debit Card"
                  description="Pay securely with Stripe"
                >
                  {stripeError && (
                    <div className={styles.errorMessage}>{stripeError}</div>
                  )}

                  {isCreatingOrder && !clientSecret && (
                    <div className={styles.loadingContainer}>
                      <div className={styles.spinner}></div>
                      <div className={styles.loadingText}>
                        Creating your order
                      </div>
                    </div>
                  )}

                  {clientSecret && (
                    <StripePaymentProvider
                      clientSecret={clientSecret}
                      amount={totalPrice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    >
                      <StripePaymentForm
                        amount={totalPrice}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </StripePaymentProvider>
                  )}
                </PaymentMethodCard>

                {/* other payments methods */}
              </div>
              {/* Summary */}
              <div className={styles.summary}>
                <h3>Order summary</h3>
                <div className={styles.summaryRow}>
                  <span>Items ({items.length})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <hr className={styles.divider} />
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.success}>
                <Check size={80} strokeWidth={2} />
                <h2>Order placed successfully</h2>
                <p>Your order {orderId} has been confirmed</p>
                <p className={styles.shippingInfo}>
                  Shipping to{" "}
                  <strong>
                    Vu Nguyen Duy Linh, 97/10, Khanh Hoi Ward, Ho Chi Minh City,
                    Vietnam
                  </strong>
                </p>

                <button
                  onClick={() => router.push("/user/orders")}
                  className={styles.continueButton}
                >
                  Go to my orders
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
