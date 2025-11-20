import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, MessageCircle, Sparkles, UserCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCadetProgress } from "@/lib/practice/progress";

const mentors = [
  {
    name: "Capt. Hana G.",
    role: "A350 / Assessment Coach",
    focus: "Behavioral interviews, leadership stories, stress management.",
    slots: "Tue & Thu evenings",
  },
  {
    name: "FO Dawit M.",
    role: "737 / Tech Mentor",
    focus: "Systems refreshers, performance math, QRH mindset.",
    slots: "Weekend mornings",
  },
  {
    name: "Sara T.",
    role: "Cabin & CRM Coach",
    focus: "Communication tone, empathy, English articulation.",
    slots: "Mon–Fri on request",
  },
];

const processSteps = ["Submit goal & availability", "Match with mentor", "Live session + annotated report", "Track follow-up actions"];

const groupSessions = [
  {
    title: "Mock Panel Lab #7",
    date: "Aug 25 · 18:00 EAT",
    description: "Three-candidate panel simulation with multi-airline assessors.",
  },
  {
    title: "CRM & TEM Workshop",
    date: "Aug 30 · 20:00 EAT",
    description: "Scenario-based practice with real OCC-style disruptions.",
  },
];

function formatDateTime(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function CoachingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const progress = await getCadetProgress(user.id);

  const mentorStats = [
    {
      label: "1:1 sessions this week",
      value: progress.sessionsThisWeek.toString(),
      detail: progress.streakDays > 0 ? `${progress.streakDays}-day streak` : "Start your streak today",
    },
    {
      label: "Interview recordings",
      value: progress.interviewCount.toString(),
      detail: progress.lastInterview ? `Latest · ${formatDateTime(progress.lastInterview.created_at)}` : "No interviews logged yet",
    },
    {
      label: "Discussion saves",
      value: progress.discussionCount.toString(),
      detail: progress.lastDiscussion ? `Side ${progress.lastDiscussion.assigned_side}` : "Run a debate drill",
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-sky">Coaching</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Mentor feedback loops</h1>
        <p className="text-sm text-muted-foreground">
          Book 1:1 coaching with Ethiopian Airlines alumni, upload recordings, and receive annotated scorecards that map to real airline standards.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {mentorStats.map((stat) => (
          <Card key={stat.label} className="border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
              <p className="text-sm text-muted-foreground">{stat.detail}</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-dashed border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/60">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>1:1 mentor pool</CardTitle>
              <p className="text-sm text-muted-foreground">
                Structured sessions with annotated transcripts, goals, and follow-up tasks.
              </p>
            </div>
            <Sparkles className="h-8 w-8 text-brand-sky" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {mentors.map((mentor) => (
                <Card key={mentor.name} className="border-slate-200 dark:border-slate-800">
                  <CardContent className="space-y-1 p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-4 w-4 text-brand-sky" />
                      <span className="font-semibold text-slate-900 dark:text-white">{mentor.name}</span>
                    </div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{mentor.role}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{mentor.focus}</p>
                    <p className="text-xs text-slate-500">Slots: {mentor.slots}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm text-muted-foreground dark:border-slate-800 dark:bg-slate-900/50">
              <p className="font-semibold text-slate-900 dark:text-white">How it works</p>
              <ol className="mt-2 space-y-2">
                {processSteps.map((step, idx) => (
                  <li key={step} className="flex gap-2">
                    <span className="font-semibold text-brand-sky">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <Button className="gap-2 bg-brand-sky hover:bg-brand-sky/90">
              <MessageCircle className="h-4 w-4" />
              Request a mentor match
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/95 shadow-soft-lg dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle>Group sessions & labs</CardTitle>
            <p className="text-sm text-muted-foreground">Join rotating labs focused on mock panels, CRM, and pronunciation.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {groupSessions.map((session) => (
              <div key={session.title} className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{session.title}</p>
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                  </div>
                  <Badge variant="secondary">{session.date}</Badge>
                </div>
                <Button variant="ghost" className="mt-3 gap-1 text-brand-sky">
                  Reserve seat
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-sky">Recent activity</p>
            <CardTitle>Latest recordings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-dashed border-slate-200/70 p-4 dark:border-slate-800">
              <p className="text-xs uppercase tracking-wide text-slate-400">Interview</p>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {progress.lastInterview?.question ?? "No mock panel yet"}
              </p>
              <p>{progress.lastInterview ? progress.lastInterview.category : "Pick any category to begin."}</p>
              <p className="text-xs text-slate-400">{progress.lastInterview ? formatDateTime(progress.lastInterview.created_at) : "—"}</p>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-200/70 p-4 dark:border-slate-800">
              <p className="text-xs uppercase tracking-wide text-slate-400">Discussion</p>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {progress.lastDiscussion ? `Assigned side: ${progress.lastDiscussion.assigned_side}` : "No debates yet"}
              </p>
              <p>{progress.lastDiscussion?.feedback ?? "Launch a debate drill to unlock captain feedback."}</p>
              <p className="text-xs text-slate-400">{progress.lastDiscussion ? formatDateTime(progress.lastDiscussion.created_at) : "—"}</p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="flex-1 gap-2 bg-brand-sky hover:bg-brand-sky/90">
                <Link href="/interview">
                  Resume interview
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 gap-2">
                <Link href="/discussion">
                  Open debate
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Momentum</p>
              <CardTitle>Recent wins</CardTitle>
            </div>
            <MessageCircle className="h-6 w-6 text-brand-sky" />
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {progress.recentWins.length ? (
              progress.recentWins.map((win) => (
                <div key={`${win.label}-${win.created_at}`} className="rounded-2xl border border-slate-200/70 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                    <span>{win.label}</span>
                    <span>{formatDateTime(win.created_at)}</span>
                  </div>
                  <p className="mt-1 text-slate-900 dark:text-white">{win.detail}</p>
                </div>
              ))
            ) : (
              <p>No activity logged yet. Record a session or add a note to see progress here.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="border border-dashed border-brand-sky/30 bg-brand-sky/5">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Need a bespoke plan?</CardTitle>
            <p className="text-sm text-muted-foreground">
              Share your target airline, interview date, and recordings. We’ll prepare a tailored coaching sprint.
            </p>
          </div>
          <CalendarDays className="h-8 w-8 text-brand-sky" />
        </CardHeader>
        <CardContent>
          <Button asChild className="gap-2 bg-brand-sky hover:bg-brand-sky/90">
            <Link href="/contact">
              Build my plan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs uppercase tracking-[0.4em] text-slate-400">
        Async feedback + coach availability dashboard launching soon
      </p>
    </div>
  );
}

