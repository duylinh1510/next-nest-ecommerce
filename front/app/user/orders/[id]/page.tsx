import OrderDetailClient from "@/components/modules/orders/OrderDetailClient";

export const revalidate = false;

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailClient id={id} />;
}

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Order #${params.id}`,
    description: "Order details",
  };
}
