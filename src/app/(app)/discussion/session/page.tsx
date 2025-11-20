"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
// Removed next/ imports for preview compatibility
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// --- TYPES ---
interface ScoreItem {
  criteria: string;
  score: number;
}

interface Feedback {
  topic?: string;
  side?: "for" | "against";
  transcript: string;
  totalScore: number;
  scores: ScoreItem[];
  feedback: string;
  audioUrl?: string | null;
}

const DEFAULT_FEEDBACK: Feedback = {
  transcript: "No speech detected or error occurred.",
  totalScore: 0,
  scores: [
    { criteria: "Clarity & Structure", score: 0 },
    { criteria: "Respectful Challenge", score: 0 },
    { criteria: "Use of Examples", score: 0 },
    { criteria: "Confidence & Tone", score: 0 },
    { criteria: "Conclusion Strength", score: 0 },
  ],
  feedback: "Something went wrong with the judge. Please try again.",
  audioUrl: null,
};

export default function DiscussionSession() {
  // const router = useRouter();
  const [topic, setTopic] = useState("Contacting Tower...");
  const [side, setSide] = useState<"for" | "against">("for");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const replaceRecordingUrl = (nextUrl: string | null) => {
    setRecordingUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
  };

  useEffect(() => {
    return () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    };
  }, [recordingUrl]);

  // 1. LOAD TOPIC ON MOUNT
  useEffect(() => {
    generateNewTopic();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, );

  const generateNewTopic = async () => {
    setTopic("AI Captain is preparing your challenge...");
    setFeedback(null);
    setTimeLeft(120);
    replaceRecordingUrl(null);

    try {
      const res = await fetch("/api/discussion/generate-topic");
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setTopic(data.topic || "Fallback topic");
      setSide(data.side || "for");
    } catch (error) {
      setTopic("The Captain is always right. Agree or Disagree?");
      setSide("for");
      console.log(error);
    }
  };

  // 2. RECORDING LOGIC
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) =>
        audioChunksRef.current.push(e.data);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await processAndJudge(audioBlob);
        stream.getTracks().forEach((t) => t.stop()); // Stop mic light
      };

      mediaRecorder.start();
      setIsRecording(true);
      replaceRecordingUrl(null);

      // Countdown Timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      alert("Microphone access denied. Check your browser settings.");
      console.log(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // 3. JUDGING & SAVING LOGIC (The Critical Fix)
  const processAndJudge = async (audioBlob: Blob) => {
    setIsProcessing(true);
    const localPlaybackUrl = URL.createObjectURL(audioBlob);
    replaceRecordingUrl(localPlaybackUrl);
    const uploadPromise = uploadRecording(audioBlob);
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("topic", topic);
    formData.append("side", side);

    try {
      // A. Call API
      const res = await fetch("/api/discussion/judge", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Judge API failed");

      const rawResult = await res.json();
      const storedAudioUrl = await uploadPromise;

      // B. Apply Safe Defaults (Prevents crashes if API returns nulls)
      const safeResult: Feedback = {
        topic,
        side,
        transcript: rawResult.transcript || "No transcript",
        totalScore:
          typeof rawResult.totalScore === "number" ? rawResult.totalScore : 0,
        scores:
          Array.isArray(rawResult.scores) && rawResult.scores.length > 0
            ? rawResult.scores
            : DEFAULT_FEEDBACK.scores,
        feedback: rawResult.feedback || "No feedback provided.",
        audioUrl: storedAudioUrl ?? null,
      };

      setFeedback(safeResult);

      // C. Save to Supabase (With Auth Check)
      await saveToDatabase(safeResult, storedAudioUrl);
    } catch (err) {
      console.error("Judge/Save Error:", err);
      setFeedback(DEFAULT_FEEDBACK);
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadRecording = async (audioBlob: Blob) => {
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const filePath = `discussion/${user.id}/${Date.now()}-${
        typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
      }.webm`;

      const { error } = await supabase.storage
        .from("discussion-audio")
        .upload(filePath, audioBlob, {
          cacheControl: "3600",
          contentType: audioBlob.type || "audio/webm",
          upsert: false,
        });

      if (error) throw error;
      const { data } = supabase.storage.from("discussion-audio").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Audio upload failed:", error);
      return null;
    }
  };

  const saveToDatabase = async (result: Feedback, audioUrl?: string | null) => {
    const supabase = createSupabaseBrowserClient();

    // 1. Check Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.log("No user logged in, skipping save.");
      return;
    }

    // 2. Format Scores for DB
    // Ensure scores isn't undefined before reducing
    const scoreMap = (result.scores || []).reduce<Record<string, number>>((acc, item: ScoreItem) => {
      acc[item.criteria] = item.score;
      return acc;
    }, {});

    // 3. Insert
    const { error } = await supabase.from("discussion_sessions").insert({
      user_id: user.id,
      topic_id: result.topic ?? topic,
      assigned_side: result.side ?? side,
      transcript: result.transcript,
      score: scoreMap, // Stores as JSONB
      feedback: result.feedback,
      audio_url: audioUrl ?? null,
    } as any); // 'as any' bypasses strict type checks if DB types are outdated

    if (error) console.error("Supabase Insert Error:", error);
  };

  // Utilities
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 pb-20">
      {/* Header / Nav */}
      <div className="flex justify-between items-center">
        <a href="/discussion">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Exit
          </Button>
        </a>
        <Button
          variant="outline"
          size="sm"
          onClick={generateNewTopic}
          disabled={isRecording || isProcessing}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Skip Topic
        </Button>
      </div>

      <Card className="p-8 md:p-12 text-center space-y-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20">
        {/* Challenge Display */}
        <div>
          <p className="text-sm uppercase tracking-wider text-amber-600 font-bold mb-2">
            Current Challenge
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-foreground">
            {topic}
          </h1>
          <p className="text-2xl mt-6">
            Argue{" "}
            <span className="font-bold underline decoration-amber-500 underline-offset-4">
              {side.toUpperCase()}
            </span>
          </p>
        </div>

        {/* Timer */}
        <div
          className={`text-7xl md:text-8xl font-mono font-bold ${
            timeLeft < 30 ? "text-red-500 animate-pulse" : "text-amber-600"
          }`}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          {!isRecording && !isProcessing && !feedback && (
            <Button
              size="lg"
              onClick={startRecording}
              className="gap-4 text-xl px-12 py-8 h-auto rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-amber-600/20 transition-all"
            >
              <Mic className="h-8 w-8" />
              Start Speaking
            </Button>
          )}

          {isRecording && (
            <Button
              size="lg"
              variant="destructive"
              onClick={stopRecording}
              className="gap-4 text-xl px-12 py-8 h-auto rounded-full animate-pulse shadow-lg"
            >
              <MicOff className="h-8 w-8" />
              Stop & Judge
            </Button>
          )}
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-amber-600 mb-4" />
            <p className="text-xl font-medium text-amber-700 dark:text-amber-400">
              The Captain is reviewing your performance...
            </p>
          </div>
        )}
      </Card>

      {/* Feedback Section */}
      {feedback && !isProcessing && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Card className="p-8 md:p-12 space-y-10 border-amber-200 dark:border-amber-800 shadow-2xl">
            <div className="text-center border-b border-amber-100 dark:border-amber-900/50 pb-8">
              <h2 className="text-4xl font-bold">
                Final Score:{" "}
                <span
                  className={
                    feedback.totalScore > 70
                      ? "text-green-600"
                      : "text-amber-600"
                  }
                >
                  {feedback.totalScore}/100
                </span>
              </h2>
            </div>

            {(() => {
              const playableUrl = recordingUrl ?? feedback.audioUrl ?? null;
              if (!playableUrl) return null;
              return (
                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-left dark:border-amber-800 dark:bg-amber-900/20">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        Session audio replay
                      </p>
                      {feedback.topic ? (
                        <p className="text-xs text-amber-700/80 dark:text-amber-200/70">
                          Topic: {feedback.topic} {feedback.side ? `(${feedback.side.toUpperCase()})` : ""}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <audio controls className="mt-3 w-full" src={playableUrl}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {feedback.scores.map((s, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-center"
                >
                  <p className="text-xs uppercase tracking-wide opacity-70 mb-1">
                    {s.criteria}
                  </p>
                  <p className="text-3xl font-bold text-amber-700 dark:text-amber-500">
                    {s.score}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl p-8 border-l-4 border-amber-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">👮‍♂️</span> Captain&apos;s Verdict
              </h3>
              <p className="text-lg leading-relaxed whitespace-pre-wrap opacity-90">
                {feedback.feedback}
              </p>
            </div>

            <div className="text-center pt-4">
              <Button onClick={generateNewTopic} variant="secondary" size="lg">
                Next Challenge
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
