import CheckoutSuccessClient from "@/components/modules/checkout/CheckoutSuccessClient";
import { Suspense } from "react";

export const revalidate = false;

export default function CheckoutSuccessPage() {
  return (
    // Suspense bắt buộc vì useSearchParams() là Client hook
    <Suspense
      fallback={
        <div style={{ padding: "4rem", textAlign: "center" }}>Loading…</div>
      }
    >
      <CheckoutSuccessClient />
    </Suspense>
  );
}

export function generateMetadata() {
  return {
    title: "Payment Successful",
    description: "Your order has been placed successfully",
  };
}
