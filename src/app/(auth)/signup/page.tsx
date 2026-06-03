import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthScene } from "@/components/auth/auth-scene";
import { normalizeNextPath } from "@/lib/auth/navigation";
import { getServerUser } from "@/lib/auth/session";

type SignupPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const destination = normalizeNextPath(params.next);
  const user = await getServerUser();

  if (user) {
    redirect(destination);
  }

  return (
    <AuthScene>
      <AuthForm mode="signup" nextPath={destination} />
    </AuthScene>
  );
}
