import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, MessageCircle, Play, Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DiscussionSession = {
  id: string;
  topic_id: string | null;
  assigned_side: "for" | "against";
  transcript: string | null;
  audio_url: string | null;
  score: Record<string, number> | null;
  feedback: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function formatScore(score: number | null | undefined) {
  if (typeof score !== "number") return "text-muted-foreground";
  if (score >= 16) return "text-green-600 dark:text-green-400";
  if (score >= 12) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export default async function DiscussionHistoryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("discussion_sessions")
    .select("id, topic_id, assigned_side, transcript, audio_url, score, feedback, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const sessions: DiscussionSession[] = data ?? [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/discussion">
            <Button variant="ghost" className="gap-2 mb-3">
              <ArrowLeft className="h-4 w-4" />
              Discussion lobby
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Discussion history</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review past cockpit debates, feedback, and audio recordings.</p>
        </div>
        <Link href="/discussion/session">
          <Button className="gap-2 bg-brand-gold text-brand-cockpit hover:bg-brand-gold/90">
            <Mic className="h-4 w-4" />
            Start new drill
          </Button>
        </Link>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No discussions yet</h2>
          <p className="text-muted-foreground mb-6">Launch a cockpit debate to unlock history and insights.</p>
          <Link href="/discussion/session">
            <Button className="gap-2 bg-brand-gold text-brand-cockpit hover:bg-brand-gold/90">
              <Mic className="h-4 w-4" />
              Start first drill
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {sessions.map((session) => (
            <Card key={session.id} className="border-white/60 bg-white/95 shadow-soft-lg dark:border-slate-800/70 dark:bg-slate-900/70">
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="uppercase">
                    Side · {session.assigned_side.toUpperCase()}
                  </Badge>
                  {session.topic_id ? (
                    <Badge variant="secondary" className="text-xs">
                      Topic
                    </Badge>
                  ) : null}
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white">
                  {session.topic_id ?? "Topic unavailable"}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(session.created_at)}
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {session.score ? (
                  <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-brand-gold" />
                      Score breakdown
                    </p>
                    <div className="grid gap-3 md:grid-cols-5">
                      {Object.entries(session.score).map(([criteria, value]) => (
                        <div key={criteria} className="rounded-xl border border-slate-200/70 p-3 text-center dark:border-slate-800">
                          <p className="text-xs text-muted-foreground mb-1">{criteria}</p>
                          <p className={`text-2xl font-bold ${formatScore(typeof value === "number" ? value : null)}`}>
                            {typeof value === "number" ? value : "—"}
                          </p>
                          <p className="text-[11px] uppercase tracking-wide text-slate-400">/ 20</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {session.transcript ? (
                  <div className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
                    <p className="mb-2 font-semibold">Transcript</p>
                    <p className="whitespace-pre-wrap leading-relaxed">{session.transcript}</p>
                  </div>
                ) : null}

                {session.feedback ? (
                  <div className="rounded-2xl border border-brand-gold/20 bg-brand-gold/5 p-4 text-sm text-slate-800 dark:text-slate-100">
                    <p className="mb-2 font-semibold text-brand-gold">Captain feedback</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{session.feedback}</p>
                  </div>
                ) : null}

                {session.audio_url ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <Play className="h-5 w-5 text-brand-gold" />
                    <audio controls className="w-full">
                      <source src={session.audio_url} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

