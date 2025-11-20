import { redirect } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <SiteShell user={user}>{children}</SiteShell>;
}

