"use client";

import Footer from "@/components/modules/landing/Footer";
import Header from "@/components/modules/landing/Header";
import OrdersClient from "@/components/modules/orders/OrdersClient";

export default function UserOrdersPage() {
  return (
    <>
      <Header />
      <OrdersClient />
      <Footer />
    </>
  );
}
