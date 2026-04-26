"use client";

import CartClient from "@/components/modules/cart/CartClient";
import Footer from "@/components/modules/landing/Footer";
import Header from "@/components/modules/landing/Header";
import React from "react";

export default function page() {
  return (
    <>
      <Header />
      <CartClient />
      <Footer />
    </>
  );
}
