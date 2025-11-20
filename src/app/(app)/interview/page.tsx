import Link from "next/link";
import { ArrowRight, MicVocal, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

const categories = ["HR & Motivation", "Competency (STAR)", "Airline Knowledge", "Technical Rapid Fire"];

export default async function InterviewPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get last session
  let lastSession = null;
  if (user) {
    const { data } = await supabase
      .from("interview_sessions")
      .select("question, category, total_score, feedback, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    lastSession = data;
  }
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-sky">
          Interview Simulator
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Speech-based mock panels</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Record responses, upload audio, and get AI feedback on clarity, tone, filler words, and structure.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="gap-2 bg-brand-sky hover:bg-brand-sky/90">
              <Link href="/interview/session">
                <MicVocal className="h-4 w-4" />
                Start session
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/interview/history">
                <History className="h-4 w-4" />
                View History
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-brand-sky/30 bg-brand-sky/5">
          <CardHeader>
            <CardTitle>Last practiced question</CardTitle>
            {lastSession ? (
              <>
                <p className="text-sm text-muted-foreground mt-2">
                  "{lastSession.question}"
                </p>
                {lastSession.category && (
                  <Badge className="mt-2 w-fit bg-brand-sky/20 text-brand-sky border-brand-sky/30">
                    {lastSession.category}
                  </Badge>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                No practice sessions yet. Start your first interview practice!
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {lastSession ? (
              <>
                {lastSession.total_score !== null && (
                  <p>
                    Score:{" "}
                    <span
                      className={`font-semibold ${
                        lastSession.total_score >= 80
                          ? "text-green-600"
                          : lastSession.total_score >= 60
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {lastSession.total_score}/100
                    </span>
                  </p>
                )}
                <p className="text-xs">
                  {new Date(lastSession.created_at).toLocaleDateString()}
                </p>
                <Button asChild variant="ghost" className="gap-1 text-brand-sky">
                  <Link href="/interview/history">
                    Review full feedback
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild className="gap-2 bg-brand-sky hover:bg-brand-sky/90">
                <Link href="/interview/session">
                  <MicVocal className="h-4 w-4" />
                  Start First Practice
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question categories</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {categories.map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm dark:border-slate-800"
              >
                <span>{label}</span>
                <Button asChild variant="ghost" className="gap-1 text-brand-sky">
                  <Link href={`/interview/session?category=${encodeURIComponent(label)}`}>
                    Practice
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

