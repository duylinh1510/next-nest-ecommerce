"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePayment } from "@/hooks/usePayment";
import { Check, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

type Status = "loading" | "success" | "failed";

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { confirmPayment } = usePayment();

  const [status, setStatus] = useState<Status>("loading");
  const [orderId, setOrderId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      const redirectStatus = searchParams.get("redirect_status");
      const paymentIntentId = searchParams.get("payment_intent");
      const storedOrderId = sessionStorage.getItem("pendingOrderId") ?? "";

      setOrderId(storedOrderId);

      // Stripe báo thất bại
      if (redirectStatus !== "succeeded" || !paymentIntentId) {
        setErrorMessage("Payment was not completed. Please try again.");
        setStatus("failed");
        return;
      }

      // Báo backend xác nhận thanh toán
      const confirmed = await confirmPayment({
        orderId: storedOrderId,
        paymentIntentId,
      });

      if (confirmed) {
        sessionStorage.removeItem("pendingOrderId");
        setStatus("success");
      } else {
        setErrorMessage(
          "Payment confirmed by Stripe but failed to update order. Please contact support.",
        );
        setStatus("failed");
      }
    };

    void run();
  }, []); // chỉ chạy 1 lần khi mount

  if (status === "loading") {
    return (
      <section
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Loader2 size={48} style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ marginTop: "1rem" }}>Confirming your payment…</p>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <XCircle size={64} color="#dc2626" />
          <h2 style={{ marginTop: "1rem" }}>Payment Failed</h2>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>{errorMessage}</p>
          <Link
            href="/checkout"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.75rem 2rem",
              background: "#000",
              color: "#fff",
              borderRadius: "0.375rem",
            }}
          >
            Try again
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Check size={80} color="#16a34a" />
        <h2 style={{ marginTop: "1rem" }}>Payment Successful!</h2>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>
          Order #{orderId} has been confirmed.
        </p>
        <Link
          href="/user/orders"
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            padding: "0.75rem 2rem",
            background: "#000",
            color: "#fff",
            borderRadius: "0.375rem",
          }}
        >
          View my orders
        </Link>
      </div>
    </section>
  );
}
