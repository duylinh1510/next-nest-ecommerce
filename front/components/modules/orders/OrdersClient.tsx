"use client";

import useOrder from "@/hooks/useOrder";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import styles from "./oders.module.scss";
import { Package } from "lucide-react";

const LIMIT = 10;

export default function OrdersClient() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { orders, ordersMeta, listLoading, listError, getAllOrders } =
    useOrder();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const fetchOrders = useCallback(async () => {
    await getAllOrders({
      limit: LIMIT,
      page: String(page),
      ...(status ? { status } : {}),
    });
  }, [getAllOrders, page, status]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/user/orders");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  if (!isAuthenticated) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.hint}>Redirecting to sign in…</p>
        </div>
      </section>
    );
  }

  const totalPages =
    ordersMeta && ordersMeta.limit > 0
      ? Math.max(1, Math.ceil(ordersMeta.total / ordersMeta.limit))
      : 1;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>My orders</h1>
        <p className={styles.hint}>
          Orders placed with your account. You can filter by status if your API
          supports it.
        </p>

        <div className={styles.toolbar}>
          <label htmlFor="order-status" className={styles.hint}>
            Status
          </label>
          <select
            id="order-status"
            className={styles.statusSelect}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        {listError && (
          <div className={styles.error} role="alert">
            {listError}
            <button
              type="button"
              className={styles.retry}
              onClick={() => void fetchOrders()}
            >
              Retry
            </button>
          </div>
        )}

        {listLoading && (
          <div className={styles.loading} aria-live="polite">
            Loading orders…
          </div>
        )}

        {!listLoading && !listError && orders.length === 0 && (
          <div className={styles.empty}>
            <Package size={48} strokeWidth={1.25} />
            <p>No orders yet.</p>
          </div>
        )}

        {!listLoading && orders.length > 0 && (
          <ul className={styles.list} aria-label="Order list">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/user/orders/${o.id}`}
                  className={styles.card}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.orderId}>Order #{o.id}</span>
                    <span className={styles.status}>{o.status}</span>
                  </div>
                  <div className={styles.meta}>
                    <span>
                      {new Date(o.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    <span className={styles.total}>
                      ${Number(o.total).toFixed(2)}
                    </span>
                    <span>
                      {o.items?.length ?? 0} line item
                      {o.items?.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {ordersMeta && ordersMeta.total > 0 && totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1 || listLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page >= totalPages || listLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}

        <Link href="/" className={styles.backLink}>
          Back to store
        </Link>
      </div>
    </section>
  );
}
