// app/notebook/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NotebookEditor } from "../components/NotebookEditor";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: note } = await supabase
    .from("notebook_pages")
    .select("id, title, content, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!note) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button asChild variant="ghost">
          <Link href="/notebook">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Notebook Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{note.title}</h1>
        <div className="w-28" />
      </div>

      <NotebookEditor
        noteId={note.id}
        initialContent={note.content ?? ""}
        title={note.title}
      />
    </div>
  );
}
