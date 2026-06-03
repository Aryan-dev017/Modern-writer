import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthScene } from "@/components/auth/auth-scene";
import { normalizeNextPath } from "@/lib/auth/navigation";
import { getServerUser } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const destination = normalizeNextPath(params.next);
  const user = await getServerUser();

  if (user) {
    redirect(destination);
  }

  let initialError: string | null = null;
  if (params.error) {
    try {
      initialError = decodeURIComponent(params.error);
    } catch {
      initialError = params.error;
    }
  }

  return (
    <AuthScene>
      <AuthForm mode="login" nextPath={destination} initialError={initialError} />
    </AuthScene>
  );
}
