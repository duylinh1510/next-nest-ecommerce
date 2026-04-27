import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import styles from "./stripe-payment-form.module.scss";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function StripePaymentProvider({
  clientSecret,
  children,
  amount,
  onSuccess,
  onError,
}: {
  clientSecret: string;
  children: React.ReactNode;
  amount: number;
  onSuccess: (paymentIntent: string) => void;
  onError: (error: string) => void;
}) {
  const appearance: Appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#de6824",
      colorBackground: "#ffffff",
      colorText: "#1e293b",
      colorDanger: "#ef4444",
      fontFamily: "poppins",
      spacingUnit: "4px",
      borderRadius: "6px",
    },
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

export function StripePaymentForm({
  amount,
  onSuccess,
  onError,
}: {
  amount: number;
  onSuccess: (paymentIntent: string) => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "An error occured with your payment");
        onError(error.message || "Payment failed");
        alert(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        alert(`Payment successful. Amount: $${amount.toFixed(2)}`);
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occured");
      onError("Unexpected Error");
      alert("Payment Error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <PaymentElement />
      <div className={styles.submitContainer}>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={styles.submitButton}
        >
          {isLoading ? (
            <>
              <Loader2 className={styles.spinner} /> Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
      </div>

      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </form>
  );
}
