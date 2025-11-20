// app/notebook/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function createNote(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const title = (formData.get("title") as string) || "Untitled Note";
  const template = formData.get("template") as string;

  const sectionMap: Record<string, string> = {
    strengths: "My Strengths",
    weaknesses: "Safe Weaknesses",
    stories: "Competency Stories",
    "self-assessment": "Self-Assessment Notes",
  };

  const finalTitle = template ? sectionMap[template] || title : title;

  const { data: note } = await supabase
    .from("notebook_pages")
    .insert({
      user_id: user.id,
      title: finalTitle,
      slug: slugify(finalTitle + "-" + Date.now()),
      content: template ? `<h2>${finalTitle}</h2><p>Start writing…</p>` : "",
      section: template || "general",
    })
    .select()
    .single();

  revalidatePath("/notebook");
  redirect(`/notebook/${note.id}`);
}

export async function updateNote(id: string, content: string, title?: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const updateData: any = { content };
  if (title) updateData.title = title;

  const { error } = await supabase
    .from("notebook_pages")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/notebook");
  revalidatePath(`/notebook/${id}`);
}

// Add to your existing actions.ts
export async function createFolder() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from("notebook_pages")
    .insert({
      user_id: user.id,
      title: "New Folder",
      slug: "folder-" + Date.now(),
      is_folder: true,
      sort_order: 999,
    })
    .select()
    .single();

  revalidatePath("/notebook");
}

export async function deleteItem(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("notebook_pages").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/notebook");
}

export async function renameItem(id: string, title: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notebook_pages")
    .update({ title })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/notebook");
}

export async function reorderItems(items: any[]) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const updates = items.map((item, index) => ({
    id: item.id,
    sort_order: index,
  }));

  await supabase.from("notebook_pages").upsert(updates);
}