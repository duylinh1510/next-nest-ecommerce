"use client";
import styles from "./login-form.module.scss";
import { Info, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const { error, isLoading, login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const success = await login({ email, password });

    if (success) {
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/");
    }
  };

  const [email, setEmail] = useState("user1@example.com");
  const [password, setPassword] = useState("User123");

  return (
    <section className={styles.section}>
      {/* container */}
      <div className={styles.container}>
        {/* form */}
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account to continue</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.error}>
                <Info size={20} /> {error ?? "Error here"}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user1@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password here"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className={styles.spinner} />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
