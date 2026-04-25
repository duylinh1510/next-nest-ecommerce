"use client";

import React, { useEffect } from "react";
import styles from "./similar-products.module.scss";
import ProductCard from "../landing/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function SimilarProducts({
  category,
  currentProductId,
}: {
  category: string;
  currentProductId: string;
}) {
  const { products, getProducts } = useProducts();

  //Fetch similar products when category changes
  useEffect(() => {
    if (category) {
      getProducts({ category, limit: 8 });
    }
  }, [category, getProducts]);

  const similarProducts = products
    .filter((product) => product.id !== currentProductId)
    .slice(0, 4);
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Similar Products</h2>
          <p>You might also like these products</p>
        </div>
        <div className={styles.grid}>
          {similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
