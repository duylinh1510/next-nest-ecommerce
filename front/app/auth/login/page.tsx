import LoginForm from "@/components/modules/auth/LoginForm";
import GoogleCallbackHandler from "@/components/modules/auth/GoogleCallbackHandler";

export const revalidate = false;

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{
    accessToken?: string;
    refreshToken?: string;
    user?: string;
  }>;
}) {
  const params = await searchParams;

  let parsedUser: unknown;
  if (params.user) {
    try {
      parsedUser = JSON.parse(params.user);
    } catch {
      parsedUser = undefined;
    }
  }

  return (
    <>
      <GoogleCallbackHandler
        accessToken={params.accessToken}
        refreshToken={params.refreshToken}
        user={parsedUser}
      />
      <LoginForm />
    </>
  );
}

export function generateMetadata() {
  return {
    title: `Login - Your App`,
    description: `Login to your account`,
  };
}
