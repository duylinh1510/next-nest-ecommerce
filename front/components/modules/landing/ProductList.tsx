"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "./product-list.module.scss";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { isLoading, products, getProducts, error, meta } = useProducts();

  const limit = 12;
  useEffect(() => {
    getProducts({ page, limit, search: debouncedSearch });
  }, [getProducts, page, limit, debouncedSearch]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value; // Lấy value từ ô input.

      setSearch(value); // cập nhật UI ngay.

      setPage(1); // đổi search thì về lại trang đầu.

      // sau 500ms mới setDebouncedSearch(value) với cùng value lúc gõ.
      setTimeout(() => {
        setDebouncedSearch(value);
      }, 500);
    },
    [],
  );

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (meta && page <= meta.totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Our products</h2>
          <p>Discover our created collection of premium products</p>
        </div>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        {isLoading ? (
          <div className={styles.loading}>Loading products...</div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>
            {debouncedSearch
              ? `No products found for "${debouncedSearch}"`
              : "No products available"}
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* pagination */}
            {meta && meta.totalPages > 1 && (
              <div className={styles.pagination}>
                <button onClick={handlePrevPage} disabled={page === 1}>
                  Previous
                </button>
                <span>
                  Page {page} of {meta.totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page >= meta.totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
