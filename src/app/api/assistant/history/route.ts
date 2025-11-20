import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("ai_messages")
    .select("id, role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("AI history fetch error:", error);
    return NextResponse.json({ error: "Unable to load history" }, { status: 500 });
  }

  return NextResponse.json({ messages: data ?? [] });
}

export async function DELETE() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("ai_messages").delete().eq("user_id", user.id);

  if (error) {
    console.error("AI history delete error:", error);
    return NextResponse.json({ error: "Unable to clear history" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

