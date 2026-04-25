"use client";

import React, { useEffect } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { useProducts } from "@/hooks/useProducts";
import styles from "./product-detail-client.module.scss";
import ProductDetail from "./ProductDetail";
import SimilarProducts from "./SimilarProducts";

export default function ProductDetailClient({
  productId,
}: {
  productId: string;
}) {
  const { getProduct, product, isLoading, error } = useProducts();
  useEffect(() => {
    if (productId) {
      getProduct(productId);
    }
  }, [productId, getProduct]);

  if (isLoading) {
    return (
      <div className={styles.error}>
        <div className={styles.container}>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.loading}>
        <div className={styles.container}>
          <h2>Product not found</h2>
          <p>The product you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs productName={product?.name} />
      <ProductDetail product={product} />
      <SimilarProducts
        category={product.category}
        currentProductId={product.id}
      />
    </div>
  );
}
