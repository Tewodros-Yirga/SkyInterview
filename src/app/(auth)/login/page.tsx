import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Log in • SkyInterview",
};

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <EmailAuthForm mode="login" />;
}
