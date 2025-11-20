import { redirect } from "next/navigation";
import { Trophy, Flame, NotebookPen, BookOpen, Star, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCadetProgress } from "@/lib/practice/progress";

export default async function AchievementsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const progress = await getCadetProgress(user.id);

  const milestones = [
    { title: "Consistency streak", value: `${progress.streakDays} days`, description: "Continuous practice sessions logged." },
    { title: "Notebook curator", value: `${progress.notebookCount} entries`, description: "Stories, strengths, reflections documented." },
    {
      title: "Knowledge navigator",
      value: `${progress.studySectionsCompleted} sections`,
      description: "Aviation & airline briefs summarized in notebook.",
    },
  ];

  const nextBadges = [
    { title: "Gold Streak", requirement: "14 consecutive practice days", progress: progress.streakDays, total: 14 },
    { title: "Briefing Pro", requirement: "Finish all 6 core checklists", progress: Math.min(progress.notebookCount, 6), total: 6 },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-10 w-10 text-brand-gold" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">Achievements</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Celebrate disciplined cadet habits</h1>
          </div>
        </div>
        <Badge variant="outline" className="text-brand-gold">
          Live streak: {progress.streakDays} day{progress.streakDays === 1 ? "" : "s"}
        </Badge>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {milestones.map((item) => (
          <Card key={item.title} className="border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <p className="text-3xl font-semibold text-brand-gold">{item.value}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <Card className="border border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Next badges</CardTitle>
            <Star className="h-5 w-5 text-brand-gold" />
          </CardHeader>
          <CardContent className="space-y-4">
            {nextBadges.map((badge) => {
              const percentage = Math.min(100, Math.round((badge.progress / badge.total) * 100));
              return (
                <div key={badge.title} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{badge.title}</p>
                      <p className="text-xs text-muted-foreground">{badge.requirement}</p>
                    </div>
                    <span className="text-sm font-semibold text-brand-gold">
                      {Math.min(badge.progress, badge.total)}/{badge.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-brand-gold" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
            <Button variant="outline" className="w-full gap-2 text-brand-gold">
              <Flame className="h-4 w-4" />
              Keep streak alive
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent wins</CardTitle>
            <NotebookPen className="h-5 w-5 text-brand-gold" />
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {progress.recentWins.length ? (
              progress.recentWins.map((win) => (
                <div key={`${win.label}-${win.created_at}`} className="rounded-2xl border border-slate-200/70 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                    <span>{win.label}</span>
                    <span>{new Date(win.created_at).toLocaleDateString()}</span>
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

      <section className="grid gap-5 md:grid-cols-3">
        <Card className="border border-dashed border-brand-gold/30 bg-brand-gold/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-brand-gold" />
              Study momentum
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Complete {Math.max(0, 2 - progress.studySectionsCompleted)} more knowledge sections this week to unlock the “Curriculum Finisher”
            badge.
          </CardContent>
        </Card>
        <Card className="border border-dashed border-brand-gold/30 bg-brand-gold/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-brand-gold" />
              Next action
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Upload your next interview or discussion recording to push the streak past {progress.streakDays} days.
          </CardContent>
        </Card>
        <Card className="border border-dashed border-brand-gold/30 bg-brand-gold/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4 text-brand-gold" />
              Community board
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Top cadets will be highlighted once streaks reach 21 days—keep logging practice to join the list.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

