import RegisterForm from "@/components/modules/auth/RegisterForm";

export const revalidate = false;

export default function page() {
  return <RegisterForm />;
}

export function generateMetadata() {
  return {
    title: "Register",
    description: "Create a new account",
  };
}
