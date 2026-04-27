"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useOrder from "@/hooks/useOrder";
import { useAuth } from "@/hooks/useAuth";
import styles from "./oders.module.scss";
import { Package } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import {
  StripePaymentProvider,
  StripePaymentForm,
} from "@/components/modules/checkout/stripe-payment-form";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#f59e0b",
  PROCESSING: "#3b82f6",
  SHIPPED: "#8b5cf6",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
};

export default function OrderDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    detailOrder,
    detailLoading,
    detailError,
    getOrderById,
    cancelOrder,
    cancelLoading,
    cancelError,
  } = useOrder();

  const [showConfirm, setShowConfirm] = useState(false);

  const { clientSecret, createPaymentIntent, confirmPayment } = usePayment();
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [paySuccess, setPaySuccess] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=/user/orders/${id}`);
    }
  }, [isAuthenticated, router, id]);

  useEffect(() => {
    if (isAuthenticated && id) {
      void getOrderById(id);
    }
  }, [isAuthenticated, id, getOrderById]);

  if (!isAuthenticated) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.hint}>Redirecting to sign in…</p>
        </div>
      </section>
    );
  }

  if (detailLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.loading}>Loading order…</p>
        </div>
      </section>
    );
  }

  if (!detailLoading && (detailError || !detailOrder)) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.error}>
            {detailError ?? "Order not found."}
          </div>
          <Link href="/user/orders" className={styles.backLink}>
            ← Back to orders
          </Link>
        </div>
      </section>
    );
  }

  if (!detailOrder) return null;

  const statusColor = STATUS_COLOR[detailOrder.status] ?? "#666";

  const handleCancel = async () => {
    const success = await cancelOrder(id);
    if (success) {
      // Reload lại order để thấy status CANCELLED
      void getOrderById(id);
      setShowConfirm(false);
    }
  };

  const handlePayNow = async () => {
    setPayLoading(true);
    setPayError(null);
    const created = await createPaymentIntent({
      orderId: id,
      amount: detailOrder.total,
      currency: "usd",
      description: "Order payment",
    });
    if (created) {
      setShowPayForm(true);
    } else {
      setPayError("Failed to initialize payment. Please try again.");
    }
    setPayLoading(false);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    const confirmed = await confirmPayment({ orderId: id, paymentIntentId });
    if (confirmed) {
      setPaySuccess(true);
      setShowPayForm(false);
      void getOrderById(id); // reload để thấy status mới
    } else {
      setPayError("Payment confirmed but failed to update order.");
    }
  };
  const handlePaymentError = (error: string) => {
    setPayError(error);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/user/orders" className={styles.backLink}>
            ← Back to orders
          </Link>
        </div>

        <div className={styles.cardHeader} style={{ marginBottom: "1.5rem" }}>
          <h1 className={styles.title} style={{ marginBottom: 0 }}>
            Order #{detailOrder.id}
          </h1>
          <span
            className={styles.status}
            style={{
              color: statusColor,
              background: `${statusColor}18`,
              fontSize: "0.875rem",
            }}
          >
            {detailOrder.status}
          </span>
        </div>

        {/* Meta */}
        <div className={styles.card} style={{ marginBottom: "1.5rem" }}>
          <div className={styles.meta}>
            <span>
              Placed on{" "}
              {new Date(detailOrder.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
            <span>
              Shipping to:{" "}
              <strong style={{ color: "#000" }}>
                {detailOrder.shippingAddress}
              </strong>
            </span>
          </div>
        </div>

        {detailOrder.status === "PENDING" && (
          <button
            onClick={() =>
              router.push(`/checkout?orderId=${id}&amount=${detailOrder.total}`)
            }
            style={{
              padding: "0.75rem 2rem",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            Pay Now
          </button>
        )}

        {detailOrder.status === "PENDING" && (
          <div style={{ marginBottom: "1.5rem" }}>
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                style={{
                  padding: "0.625rem 1.5rem",
                  background: "transparent",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                Cancel Order
              </button>
            ) : (
              <div
                style={{
                  padding: "1rem",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <p style={{ color: "#b91c1c", fontWeight: 500, margin: 0 }}>
                  Are you sure you want to cancel this order? This cannot be
                  undone.
                </p>
                {cancelError && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      margin: 0,
                    }}
                  >
                    {cancelError}
                  </p>
                )}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    style={{
                      padding: "0.5rem 1.25rem",
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: cancelLoading ? "not-allowed" : "pointer",
                      opacity: cancelLoading ? 0.6 : 1,
                      fontWeight: 500,
                    }}
                  >
                    {cancelLoading ? "Cancelling..." : "Yes, cancel it"}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={cancelLoading}
                    style={{
                      padding: "0.5rem 1.25rem",
                      background: "transparent",
                      border: "1px solid #e5e5e5",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Keep order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Line items */}
        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            marginBottom: "1rem",
          }}
        >
          Items ({detailOrder.items?.length ?? 0})
        </h2>
        <ul className={styles.list} style={{ marginBottom: "1.5rem" }}>
          {detailOrder.items?.map((item) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Package size={20} strokeWidth={1.5} />
                  <span style={{ fontWeight: 500 }}>
                    {(item as any).productName ?? item.productId}
                  </span>
                </div>
                <span className={styles.total}>
                  ${Number(item.subTotal).toFixed(2)}
                </span>
              </div>
              <div className={styles.meta}>
                <span>Qty: {item.quantity}</span>
                <span>Unit price: ${Number(item.price).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Total */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span style={{ fontWeight: 600, fontSize: "1.125rem" }}>
              Order Total
            </span>
            <span className={styles.total} style={{ fontSize: "1.25rem" }}>
              ${Number(detailOrder.total).toFixed(2)}
            </span>
          </div>
          <div className={styles.meta}>
            <span>Shipping: Free</span>
          </div>
        </div>
      </div>
    </section>
  );
}
