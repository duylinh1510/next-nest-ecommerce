"use client";

import React from "react";
import styles from "./breadcrumbs.module.scss";
import Link from "next/link";

export default function Breadcrumbs({ productName }: { productName?: string }) {
  return (
    <div className={styles.breadcrumbs}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Breadcrumb">
          <Link className={styles.link} href="/">
            Store
          </Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>{productName}</span>
        </nav>
      </div>
    </div>
  );
}
