import Link from "next/link";
import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h3>VUNGUYENDUYLINH STORE</h3>
            <p>
              Your first destination for quality products. We create the finest
              selection to meet your need.
            </p>
          </div>

          <div className={styles.section}>
            <h4>Shop</h4>
            <ul>
              <li>
                <Link href="/">All products</Link>
              </li>
              <li>
                <Link href="/">Categories</Link>
              </li>
              <li>
                <Link href="/">New arrivals</Link>
              </li>
              <li>
                <Link href="/">Deals</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>Support</h4>
            <ul>
              <li>
                <Link href="/">Help Center</Link>
              </li>
              <li>
                <Link href="/">Contact Us</Link>
              </li>
              <li>
                <Link href="/">Shipping Info</Link>
              </li>
              <li>
                <Link href="/">Returns</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>Company</h4>
            <ul>
              <li>
                <Link href="/">About Us</Link>
              </li>
              <li>
                <Link href="/">Careers</Link>
              </li>
              <li>
                <Link href="/">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
