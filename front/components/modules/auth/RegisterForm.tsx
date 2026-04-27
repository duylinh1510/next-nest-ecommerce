"use client";
import styles from "./login-form.module.scss";
import { Info, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&!%*?&])[A-Za-z\d@$!%*?&]/;

export default function RegisterForm() {
  const { error, isLoading, register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setClientError(null);

    if (password !== confirmPassword) {
      setClientError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setClientError("Password must be at least 8 characters.");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setClientError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@&!%*?).",
      );
      return;
    }

    const success = await register({
      email,
      password,
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
    });

    if (success) {
      router.push("/");
    }
  };

  const displayError = clientError ?? error;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Sign up to get started</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            {displayError && (
              <div className={styles.error}>
                <Info size={20} />
                {displayError}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                disabled={isLoading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={isLoading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@gmail.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="StrongP@ssw0rd!"
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
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
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "1rem",
              fontSize: "0.875rem",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
