import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpenCheck, Clock4, MessageSquare, MicVocal, NotebookPen } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSummary } from "@/lib/dashboard/data";
import { primaryNav } from "@/lib/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const moduleDescriptions: Record<string, string> = {
  "/interview": "AI speech analysis & audio history",
  "/discussion": "Timed prompts + feedback",
  "/notebook": "Templates for strengths & stories",
  "/aviation": "Structured aviation knowledge",
  "/airline": "Ethiopian Airlines briefings",
};

const moduleAssets: Record<string, string> = {
  "/interview": "/assets/Module Icon — Interview Simulator.png",
  "/discussion": "/assets/Module Icon — Group Discussion Trainer.png",
  "/notebook": "/assets/Module Icon — Candidate Notebook.png",
  "/aviation": "/assets/Module Icon — Aviation Knowledge.png",
  "/airline": "/assets/Module Icon — Airline Knowledge.png",
};

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const summary = await getDashboardSummary(user.id);
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Cadet";
  const modules = primaryNav.filter((item) => moduleDescriptions[item.href]).slice(0, 5);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/60 bg-white/95 p-8 shadow-soft-lg dark:border-slate-800 dark:bg-slate-900/80">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-sky">
            SkyInterview
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Continue your Ethiopian Airlines prep plan. Pick up the last simulator question,
            review notebook entries, or dive into knowledge decks.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="gap-2 bg-brand-sky hover:bg-brand-sky/90">
              <Link href="/interview">
                <MicVocal className="h-4 w-4" />
                Continue Interview
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 border-slate-200 text-slate-700 dark:text-white">
              <Link href="/notebook">
                <NotebookPen className="h-4 w-4" />
                Update Notebook
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
              <Clock4 className="h-4 w-4 text-brand-sky" />
              Last session · {summary.interview.practicedAt || "No session yet"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
              <BookOpenCheck className="h-4 w-4 text-brand-gold" />
              Latest note · {summary.stats[1]?.change}
            </span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-soft-lg backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
          <Image
            src="/assets/Landing Page Hero Illustration.png"
            alt="SkyInterview cockpit hero"
            width={720}
            height={520}
            className="h-full w-full object-cover"
            priority
          />
          <div className="absolute left-6 top-6 rounded-2xl border border-white/40 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-brand-sky shadow-lg dark:border-slate-800 dark:bg-slate-950/70">
            Flight Deck Focus
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summary.stats.map((stat) => (
          <Card key={stat.label} className="border-white/60 bg-white/90 shadow-soft-lg dark:border-slate-800/70 dark:bg-slate-900/70">
            <CardHeader className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {stat.label}
              </p>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
              {stat.change ? (
                <p className="text-sm text-muted-foreground">{stat.change}</p>
              ) : null}
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-brand-sky/20 bg-brand-sky/5">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-sky">
                Interview Simulator
              </p>
              <CardTitle className="mt-2 text-2xl text-slate-900 dark:text-white">
                {summary.interview.question}
              </CardTitle>
              <p className="mt-2 text-sm text-brand-sky">{summary.interview.category}</p>
            </div>
            <MicVocal className="h-10 w-10 text-brand-sky/60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {summary.interview.practicedAt
                ? `Practiced ${summary.interview.practicedAt}`
                : "Record your first mock panel to receive feedback."}
            </p>
            <Button asChild variant="ghost" className="justify-start gap-2 text-brand-sky">
              <Link href="/interview">
                Resume question
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
                Group Discussion
              </p>
              <CardTitle className="mt-2 text-xl">{summary.discussion.topic}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">{summary.discussion.practicedAt}</p>
            </div>
            <MessageSquare className="h-10 w-10 text-brand-gold/60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{summary.discussion.feedback}</p>
            <Button asChild variant="ghost" className="justify-start gap-2 text-brand-gold">
              <Link href="/discussion">
                Open trainer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card className="border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Candidate Notebook
            </p>
            <CardTitle className="text-2xl">Highlighted pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.notebook.map((note) => (
              <div
                key={note.title}
                className="rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-sky">
                  {note.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{note.excerpt}</p>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full justify-center gap-2">
              <Link href="/notebook">
                Open notebook
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Knowledge Tracks
            </p>
            <CardTitle className="text-2xl">Learning progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {summary.knowledge.map((track) => (
              <div key={track.title}>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{track.title}</span>
                  <span className="text-muted-foreground">{track.progress}%</span>
                </div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{track.segment}</p>
                <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-brand-sky"
                    style={{ width: `${track.progress}%` }}
                  />
                </div>
              </div>
            ))}
            <Button asChild variant="ghost" className="w-full justify-center gap-2 text-brand-sky">
              <Link href="/aviation">
                Review chapters
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Quick Modules
          </p>
          <h2 className="text-xl font-semibold">Jump back into any module</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                className="group rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-soft-lg transition hover:-translate-y-1 hover:border-brand-sky/40 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-brand-sky/10 p-2 text-brand-sky">
                    <Icon className="h-5 w-5" />
                  </div>
                  {moduleAssets[module.href] ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-dashed border-slate-200 bg-white/60">
                      <Image
                        src={moduleAssets[module.href]}
                        alt={module.label}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ) : null}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {module.label}
                </h3>
                <p className="text-sm text-muted-foreground">{moduleDescriptions[module.href]}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-sky">
                  Enter module
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
