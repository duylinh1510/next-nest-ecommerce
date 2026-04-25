"use client";
import { LayoutDashboard, ShoppingCart } from "lucide-react";
import styles from "./header.module.scss";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  const handleDashboardClick = () => {
    if (user && user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  const handleLogoutClick = async () => {
    await logout();
  };

  const handleLoginClick = () => {};
  return (
    <header className={styles.header}>
      {/* container */}
      <div className={styles.container}>
        {/* logo */}
        <Link href="/" className={styles.logo}>
          VUNGUYENDUYLINH STORE
        </Link>
        {/* icons */}
        <div className={styles.actions}>
          <Link href="/cart" className={styles.cartButton}>
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <LayoutDashboard onClick={handleDashboardClick} />
              <button
                onClick={handleLogoutClick}
                className={styles.logoutButton}
                disabled={isLoading}
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <button className={styles.loginButton} onClick={handleLoginClick}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
