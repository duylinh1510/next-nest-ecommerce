"use client";
import {
  LayoutDashboard,
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  Package,
} from "lucide-react";
import styles from "./header.module.scss";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/auth/login");
  };

  const handleLoginClick = () => router.push("/auth/login");

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          VUNGUYENDUYLINH STORE
        </Link>

        <div className={styles.actions}>
          <Link href="/cart" className={styles.cartButton}>
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              {/* Trigger button */}
              <button
                className={styles.userTrigger}
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <User size={20} />
                <ChevronDown
                  size={14}
                  className={dropdownOpen ? styles.chevronOpen : ""}
                />
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  {/* User info */}
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>
                      {user?.name ?? "My Account"}
                    </p>
                    <p className={styles.dropdownEmail}>{user?.email}</p>
                  </div>

                  <div className={styles.dropdownDivider} />

                  {/* Admin dashboard nếu là ADMIN */}
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                  )}

                  {/* Orders */}
                  <Link
                    href="/user/orders"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Package size={16} />
                    My Orders
                  </Link>

                  <div className={styles.dropdownDivider} />

                  {/* Logout */}
                  <button
                    className={styles.dropdownLogout}
                    onClick={handleLogoutClick}
                    disabled={isLoading}
                  >
                    <LogOut size={16} />
                    {isLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
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
