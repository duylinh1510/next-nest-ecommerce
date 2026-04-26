"use client";

import React from "react";
import styles from "./cart.module.scss";
import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
export default function CartClient() {
  const router = useRouter();
  const { items, clearAllCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      await clearAllCart();
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/cart");
    } else {
      router.push("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <ShoppingCart className={styles.emptyIcon} size={64} />
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <Link href="/" className={styles.continueButton}>
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      {/* container */}
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Shopping Cart</h1>
          <button onClick={handleClearCart} className={styles.clearButton}>
            Clear cart
          </button>
        </div>
        {/* content */}
        <div className={styles.content}>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
          {/* summary */}
          <div className={styles.summary}>
            <h2>Order summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Caculated at checkout</span>
            </div>
            <hr className={styles.divider} />
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Proceed to checkout
            </button>
            <Link className={styles.continueLink} href="/">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
