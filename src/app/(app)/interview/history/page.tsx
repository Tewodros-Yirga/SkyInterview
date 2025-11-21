"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Calendar, TrendingUp, FileText } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface InterviewSession {
  id: string;
  question: string;
  category: string;
  transcript: string | null;
  audio_url: string | null;
  total_score: number | null;
  score: Record<string, number> | null;
  feedback: string | null;
  improvements: string[] | null;
  strengths: string[] | null;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "HR & Motivation": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Competency (STAR)": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "Airline Knowledge": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Technical Rapid Fire": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default function InterviewHistory() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSessions() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (cancelled) return;

      if (error) {
        console.error("Error loading sessions:", error);
        setLoading(false);
      } else {
        setSessions((data as InterviewSession[]) || []);
        setLoading(false);
      }
    }

    loadSessions();

    return () => {
      cancelled = true;
    };
  }, []);

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading your interview history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/interview">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Interview
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Interview History
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Review your past interview practice sessions and track your progress
          </p>
        </div>
        <Link href="/interview/session">
          <Button className="gap-2 bg-brand-sky hover:bg-brand-sky/90">
            <Play className="h-4 w-4" />
            New Practice
          </Button>
        </Link>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No interview sessions yet</h2>
          <p className="text-muted-foreground mb-6">
            Start practicing to see your interview history here
          </p>
          <Link href="/interview/session">
            <Button className="gap-2 bg-brand-sky hover:bg-brand-sky/90">
              Start Your First Practice
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedSession?.id === session.id ? "ring-2 ring-brand-sky" : ""
              }`}
              onClick={() => setSelectedSession(selectedSession?.id === session.id ? null : session)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        className={
                          CATEGORY_COLORS[session.category] ||
                          "bg-slate-100 text-slate-700"
                        }
                      >
                        {session.category}
                      </Badge>
                      {session.total_score !== null && (
                        <span
                          className={`text-2xl font-bold ${getScoreColor(session.total_score)}`}
                        >
                          {session.total_score}/100
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg mb-2">{session.question}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(session.created_at)}
                      </span>
                      {session.audio_url && (
                        <span className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          Audio available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              {selectedSession?.id === session.id && (
                <CardContent className="space-y-6 pt-0">
                  {/* Transcript */}
                  {session.transcript && (
                    <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-4">
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Transcript
                      </h3>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                        {session.transcript}
                      </p>
                    </div>
                  )}

                  {/* Score Breakdown */}
                  {session.score && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" /> Score Breakdown
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {Object.entries(session.score).map(([criteria, score]) => (
                          <div
                            key={criteria}
                            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/30 text-center"
                          >
                            <p className="text-xs text-muted-foreground mb-1">{criteria}</p>
                            <p className={`text-xl font-bold ${getScoreColor(score)}`}>
                              {score}
                            </p>
                            <p className="text-xs text-muted-foreground">/ 20</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {session.strengths && session.strengths.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-950/40 rounded-xl p-4 border-l-4 border-green-500">
                      <h3 className="text-sm font-semibold mb-2 text-green-700 dark:text-green-400">
                        ✅ Strengths
                      </h3>
                      <ul className="space-y-1">
                        {session.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-green-800 dark:text-green-200">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {session.improvements && session.improvements.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl p-4 border-l-4 border-amber-500">
                      <h3 className="text-sm font-semibold mb-2 text-amber-700 dark:text-amber-400">
                        💡 Areas for Improvement
                      </h3>
                      <ul className="space-y-1">
                        {session.improvements.map((improvement, i) => (
                          <li key={i} className="text-sm text-amber-800 dark:text-amber-200">
                            • {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Feedback */}
                  {session.feedback && (
                    <div className="bg-blue-50 dark:bg-blue-950/40 rounded-xl p-4 border-l-4 border-brand-sky">
                      <h3 className="text-sm font-semibold mb-2 text-brand-sky">
                        👨‍✈️ Panel Feedback
                      </h3>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                        {session.feedback}
                      </p>
                    </div>
                  )}

                  {/* Audio Player */}
                  {session.audio_url && (
                    <div className="flex items-center justify-center">
                      <audio controls className="w-full max-w-md">
                        <source src={session.audio_url} type="audio/webm" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

