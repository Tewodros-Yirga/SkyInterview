import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create account • SkyInterview",
};

export default async function SignupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <EmailAuthForm mode="signup" />;
}

