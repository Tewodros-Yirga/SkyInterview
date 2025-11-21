// app/notebook/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type NotebookPageInsert = Database["public"]["Tables"]["notebook_pages"]["Insert"];
type NotebookPageUpdate = Database["public"]["Tables"]["notebook_pages"]["Update"];

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

  const insertData: NotebookPageInsert = {
    user_id: user.id,
    title: finalTitle,
    slug: slugify(finalTitle + "-" + Date.now()),
    content: template ? `<h2>${finalTitle}</h2><p>Start writing…</p>` : "",
    section: template || "general",
  };

  const insertResult = await (supabase
    .from("notebook_pages") as unknown as {
      insert: (values: NotebookPageInsert) => {
        select: () => { single: () => Promise<{ data: { id: string; title: string; content: string; section: string | null } | null; error: Error | null }> };
      };
    })
    .insert(insertData)
    .select()
    .single();
  
  const noteData = insertResult.data;

  if (!noteData) throw new Error("Failed to create note");

  const note = noteData as { id: string; title: string; content: string; section: string | null };

  revalidatePath("/notebook");
  redirect(`/notebook/${note.id}`);
}

export async function updateNote(id: string, content: string, title?: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const updateData: NotebookPageUpdate = { content };
  if (title) {
    updateData.title = title;
  }

  const { error } = await (supabase
    .from("notebook_pages") as unknown as {
      update: (values: NotebookPageUpdate) => {
        eq: (column: string, value: string) => {
          eq: (column: string, value: string) => Promise<{ error: Error | null }>;
        };
      };
    })
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

  const insertData: NotebookPageInsert = {
    user_id: user.id,
    title: "New Folder",
    slug: "folder-" + Date.now(),
    is_folder: true,
    sort_order: 999,
  };

  await (supabase
    .from("notebook_pages") as unknown as {
      insert: (values: NotebookPageInsert) => {
        select: () => { single: () => Promise<{ error: Error | null }> };
      };
    })
    .insert(insertData)
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

  const updateData: NotebookPageUpdate = { title };

  await (supabase
    .from("notebook_pages") as unknown as {
      update: (values: NotebookPageUpdate) => {
        eq: (column: string, value: string) => {
          eq: (column: string, value: string) => Promise<{ error: Error | null }>;
        };
      };
    })
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/notebook");
}

type ReorderItem = {
  id: string;
  sort_order?: number;
};

export async function reorderItems(items: ReorderItem[]) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const updates: NotebookPageUpdate[] = items.map((item, index) => ({
    id: item.id,
    sort_order: index,
  }));

  await (supabase
    .from("notebook_pages") as unknown as {
      upsert: (values: NotebookPageUpdate[]) => Promise<{ error: Error | null }>;
    })
    .upsert(updates);
}