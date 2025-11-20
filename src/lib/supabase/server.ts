import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import type { Database } from "./types";

// Session timeout is configured in Supabase Dashboard > Authentication > Settings
// Default is 1 hour, but can be adjusted up to 1 week

function getPublicConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase server credentials. Did you set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY?",
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export async function createSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // Note: set() is omitted to avoid Next.js "cookies can only be modified in Server Actions" errors
      // Supabase SSR will handle cookie setting automatically in Server Actions/Route Handlers
      // Session timeout: Configure in Supabase Dashboard > Authentication > Settings > JWT expiry (default: 1 hour)
      remove(name: string, options?: CookieOptions) {
        cookieStore.delete({ name, ...options });
      },
    },
  });
}
