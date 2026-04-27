import CheckoutClient from "@/components/modules/checkout/CheckoutClient";
import Header from "@/components/modules/landing/Header";
import Footer from "@/components/modules/landing/Footer";
import { Suspense } from "react";
// Nextjs ISR caching strategy
export const revalidate = false;

export default function ComponentName() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={null}>
          <CheckoutClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Page - Title here`,
    description: `Page - Description here`,
    icons: {
      icon: `path to asset file`,
    },
  };
}
