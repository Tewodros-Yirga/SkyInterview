import { ArrowRight, Headphones, Layers3, Search, DownloadCloud, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCadetProgress } from "@/lib/practice/progress";

const questionCollections = [
  {
    title: "Interview Drills",
    description: "120 curated prompts split by HR, motivation, competency, airline knowledge.",
    tags: ["HR", "Competency", "STAR"],
  },
  {
    title: "Group Discussion Topics",
    description: "50 hot-seat scenarios with pro/con briefs and challenge cards.",
    tags: ["Assertiveness", "Communication"],
  },
  {
    title: "Airline Tech Flashcards",
    description: "Rapid-fire cards covering ET fleet, alliances, and regulatory facts.",
    tags: ["Ethiopian", "Regulations"],
  },
];

const audioPlaylists = [
  {
    title: "Captain Exemplars",
    count: "24 tracks",
    description: "Model answers narrated by senior captains with delivery notes.",
  },
  {
    title: "Phraseology Lab",
    count: "12 tracks",
    description: "ATC calls, briefings, and checklist cadence for daily rehearsal.",
  },
];

const downloads = [
  {
    title: "Phraseology Cheat Sheets",
    size: "4 MB • PDF",
    description: "NATO alphabet, ATC calls, SOP callouts, hand signals.",
  },
  {
    title: "Interview Workbook",
    size: "6 MB • PDF",
    description: "STAR templates, self-review prompts, and scoring rubrics.",
  },
  {
    title: "Aviation Posters Pack",
    size: "12 MB • PNG",
    description: "Cockpit flows, four forces, ET fleet silhouettes for the study wall.",
  },
];

export default async function LibraryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const progress = await getCadetProgress(user.id);

  const collectionMeta: Record<string, string> = {
    "Interview Drills": `${progress.interviewCount} saved recordings`,
    "Group Discussion Topics": `${progress.discussionCount} debates logged`,
    "Airline Tech Flashcards": `${progress.studySectionsCompleted} notebook sections`,
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-sky">Practice Library</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Content & assets hub</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything you need to rehearse—question banks, audio exemplars, printable cheat sheets, and quick-reference decks.
          </p>
        </div>
        <Button className="gap-2" variant="outline">
          <Search className="h-4 w-4" />
          Search library
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sessions this week</p>
            <CardTitle className="text-3xl">{progress.sessionsThisWeek}</CardTitle>
            <p className="text-sm text-muted-foreground">{progress.streakDays > 0 ? `${progress.streakDays}-day streak` : "Start logging today"}</p>
          </CardHeader>
        </Card>
        <Card className="border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Notebook entries</p>
            <CardTitle className="text-3xl">{progress.notebookCount}</CardTitle>
            <p className="text-sm text-muted-foreground">Latest update · {progress.latestNotebookEntries[0]?.title ?? "Add your first note"}</p>
          </CardHeader>
        </Card>
        <Card className="border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recordings archive</p>
            <CardTitle className="text-3xl">{progress.interviewCount + progress.discussionCount}</CardTitle>
            <p className="text-sm text-muted-foreground">Interview + discussion sessions stored</p>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Curated collections</h2>
          <Badge variant="secondary">New content weekly</Badge>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {questionCollections.map((collection) => (
            <Card key={collection.title} className="border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <Layers3 className="h-6 w-6 text-brand-sky" />
                <CardTitle className="text-lg">{collection.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{collection.description}</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {collectionMeta[collection.title] ?? "Ready to use"}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 text-xs text-brand-sky">
                  {collection.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-brand-sky/10 px-3 py-1 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button variant="ghost" className="justify-start gap-1 text-brand-sky">
                  Open collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-brand-sky" />
          <h2 className="text-xl font-semibold">Audio practice playlists</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {audioPlaylists.map((playlist) => (
            <Card key={playlist.title}>
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{playlist.title}</h3>
                    <p className="text-sm text-muted-foreground">{playlist.description}</p>
                  </div>
                  <Badge>{playlist.count}</Badge>
                </div>
                <Button variant="ghost" className="justify-start gap-1 text-brand-sky">
                  Play now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <DownloadCloud className="h-5 w-5 text-brand-sky" />
          <h2 className="text-xl font-semibold">Download center</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {downloads.map((item) => (
            <Card key={item.title}>
              <CardContent className="space-y-3 p-6">
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{item.size}</p>
                <Button variant="ghost" className="justify-start gap-1 text-brand-sky">
                  Download
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-brand-sky/20 bg-brand-sky/5 p-6 text-sm text-muted-foreground dark:border-brand-sky/30 dark:bg-brand-sky/10">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-sky">Need something custom?</p>
            <p className="text-base text-slate-800 dark:text-white">
              We’re building AI-powered search and personal study plans. Tell us what resource you’re missing.
            </p>
          </div>
          <Button className="gap-2 bg-brand-sky hover:bg-brand-sky/90">
            <Sparkles className="h-4 w-4" />
            Request resource
          </Button>
        </div>
      </section>
    </div>
  );
}
