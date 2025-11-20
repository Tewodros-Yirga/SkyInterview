// app/notebook/page.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookmarkPlus, FileText, NotebookTabs } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NotebookPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null; // Auth pages will redirect

  const { data: recentNotes = [] } = await supabase
    .from("notebook_pages")
    .select("id, title, updated_at, section, content")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(5);

  // Hardcoded templates (we'll make this dynamic later)
  const templates = [
    {
      title: "My Strengths",
      subtitle: "Show your best self",
      section: "strengths",
      icon: "/assets/Module Icon — Candidate Notebook.png",
    },
    {
      title: "Safe Weaknesses",
      subtitle: "Growth mindset answers",
      section: "weaknesses",
      icon: "/assets/Module Icon — Dashboard  Progress.png",
    },
    {
      title: "Competency Stories",
      subtitle: "STAR & SOARA examples",
      section: "stories",
      icon: "/assets/Interview Coaching Illustration (STAR Method).png",
    },
    {
      title: "Self-Assessment",
      subtitle: "Track your progress",
      section: "self-assessment",
      icon: "/assets/Notebook Background Texture.png",
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Hero */}
      <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border bg-card/95 p-8 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
            Candidate Notebook
          </p>
          <h1 className="mt-3 text-4xl font-bold">
            Your Personal Interview Vault
          </h1>
          <p className="mt-4 text-muted-foreground">
            Everything you write is auto-saved, private, and ready for the
            Ethiopian Airlines panel.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/notebook/new">
                <NotebookTabs className="h-5 w-5" />
                New Note
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/notebook/templates">View All Templates</Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src="/assets/Notebook Background Texture.png"
            alt="Notebook"
            fill
            className="object-cover"
          />
          <div className="relative z-10 p-10 text-white">
            <h2 className="text-3xl font-bold">
              One story per day = unstoppable confidence
            </h2>
          </div>
        </div>
      </section>

      {/* Recent Notes */}
      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase text-muted-foreground">
                  Recent Notes
                </p>
                <CardTitle className="text-2xl">
                  Pick up where you left off
                </CardTitle>
              </div>
              <FileText className="h-10 w-10 text-sky-600" />
            </div>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                No notes yet. Create your first one!
              </p>
            ) : (
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <Link
                    key={note.id}
                    href={`/notebook/${note.id}`}
                    className="block rounded-xl border bg-muted/50 p-5 hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{note.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {note.content || "No content yet"}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(note.updated_at).toLocaleDateString()} •{" "}
                      {note.section}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Templates Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Start with a Template</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Link
              key={template.section}
              href={`/notebook/new?template=${template.section}`}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 relative mb-4">
                    <Image
                      src={template.icon}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-semibold">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.subtitle}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
