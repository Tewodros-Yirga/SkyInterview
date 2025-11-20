"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Loader2, RefreshCw, ArrowLeft, Play, Pause, Volume2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// --- TYPES ---
interface ScoreItem {
  criteria: string;
  score: number;
  maxScore: number;
}

interface InterviewFeedback {
  question?: string;
  category?: string;
  transcript: string;
  totalScore: number;
  scores: ScoreItem[];
  feedback: string;
  improvements: string[];
  strengths: string[];
}

const DEFAULT_FEEDBACK: InterviewFeedback = {
  transcript: "No speech detected or error occurred.",
  totalScore: 0,
  scores: [
    { criteria: "Content Clarity", score: 0, maxScore: 20 },
    { criteria: "Confidence & Tone", score: 0, maxScore: 20 },
    { criteria: "Structure (STAR)", score: 0, maxScore: 20 },
    { criteria: "Relevance to Question", score: 0, maxScore: 20 },
    { criteria: "Filler Words", score: 0, maxScore: 20 },
  ],
  feedback: "Something went wrong with the evaluation. Please try again.",
  improvements: [],
  strengths: [],
};

const CATEGORY_COLORS: Record<string, string> = {
  "HR & Motivation": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Competency (STAR)": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "Airline Knowledge": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Technical Rapid Fire": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default function InterviewSession() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "HR & Motivation";

  const [question, setQuestion] = useState("Preparing your interview question...");
  const [category, setCategory] = useState(categoryParam);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for interviews
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateNewQuestion = useCallback(async () => {
    setQuestion("AI is preparing your interview question...");
    setFeedback(null);
    setTimeLeft(180);
    setAudioUrl(null);
    setIsPlaying(false);

    try {
      const res = await fetch(`/api/interview/generate-question?category=${encodeURIComponent(categoryParam)}`);
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setQuestion(data.question || "Fallback question");
      setCategory(data.category || categoryParam);
    } catch (error) {
      setQuestion("Tell us about yourself and why you want to become a pilot with Ethiopian Airlines.");
      setCategory(categoryParam);
      console.log(error);
    }
  }, [categoryParam]);

  // Load question on mount
  useEffect(() => {
    generateNewQuestion();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [categoryParam, generateNewQuestion]);

  // Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAndJudge(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

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
      alert("Microphone access denied. Please check your browser settings.");
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

  // Judging & Saving Logic
  const processAndJudge = async (audioBlob: Blob) => {
    setIsProcessing(true);

    // Create preview URL
    const previewUrl = URL.createObjectURL(audioBlob);
    setAudioUrl(previewUrl);

    const formData = new FormData();
    formData.append("audio", audioBlob, "interview-recording.webm");
    formData.append("question", question);
    formData.append("category", category);

    try {
      const res = await fetch("/api/interview/judge", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Judge API failed");

      const rawResult = await res.json();

      const safeResult: InterviewFeedback = {
        question: question,
        category: category,
        transcript: rawResult.transcript || "No transcript available",
        totalScore: typeof rawResult.totalScore === "number" ? rawResult.totalScore : 0,
        scores:
          Array.isArray(rawResult.scores) && rawResult.scores.length > 0
            ? rawResult.scores.map((s: { criteria?: string; score?: number; maxScore?: number }) => ({
                criteria: s.criteria || "Unknown",
                score: typeof s.score === "number" ? s.score : 0,
                maxScore: typeof s.maxScore === "number" ? s.maxScore : 20,
              }))
            : DEFAULT_FEEDBACK.scores,
        feedback: rawResult.feedback || "No feedback provided.",
        improvements: Array.isArray(rawResult.improvements) ? rawResult.improvements : [],
        strengths: Array.isArray(rawResult.strengths) ? rawResult.strengths : [],
      };

      setFeedback(safeResult);
      await saveToDatabase(safeResult, audioBlob);
    } catch (err) {
      console.error("Judge/Save Error:", err);
      setFeedback(DEFAULT_FEEDBACK);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToDatabase = async (result: InterviewFeedback, audioBlob: Blob) => {
    const supabase = createSupabaseBrowserClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.log("No user logged in, skipping save.");
      return;
    }

    // Upload audio to Supabase Storage
    let audioUrl = null;
    try {
      const fileName = `interview-${user.id}-${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("interview-audio")
        .upload(fileName, audioBlob, {
          contentType: "audio/webm",
          upsert: false,
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from("interview-audio").getPublicUrl(fileName);
        audioUrl = urlData.publicUrl;
      }
    } catch (storageError) {
      console.warn("Audio upload failed:", storageError);
    }

    // Format scores for DB
    const scoreMap = (result.scores || []).reduce(
      (acc: Record<string, number>, item: ScoreItem) => {
        acc[item.criteria] = item.score;
        return acc;
      },
      {}
    );

    // Insert session
    // Type assertion needed: Supabase type inference issue with interview_sessions table
    // This is a known issue when Database types aren't fully recognized by Supabase client
    // @ts-expect-error - Supabase type inference limitation with interview_sessions table
    const { error } = await supabase.from("interview_sessions").insert({
      user_id: user.id,
      question: result.question || question,
      category: result.category || category,
      transcript: result.transcript,
      audio_url: audioUrl,
      score: scoreMap,
      total_score: result.totalScore,
      feedback: result.feedback,
      improvements: result.improvements,
      strengths: result.strengths,
    });

    if (error) console.error("Supabase Insert Error:", error);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlayback = () => {
    if (!audioRef.current && audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link href="/interview">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Interview
          </Button>
        </Link>
        <div className="flex gap-3">
          <Badge className={CATEGORY_COLORS[category] || "bg-slate-100 text-slate-700"}>
            {category}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={generateNewQuestion}
            disabled={isRecording || isProcessing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            New Question
          </Button>
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8 md:p-12 text-center space-y-8 bg-gradient-to-br from-brand-sky/5 via-blue-50 to-slate-50 dark:from-brand-sky/10 dark:via-slate-900/50 dark:to-slate-950 border-brand-sky/20">
        <div>
          <p className="text-sm uppercase tracking-wider text-brand-sky font-bold mb-4">
            Interview Question
          </p>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight text-foreground max-w-4xl mx-auto">
            {question}
          </h1>
        </div>

        {/* Timer */}
        <div
          className={`text-6xl md:text-7xl font-mono font-bold transition-colors ${
            timeLeft < 30
              ? "text-red-500 animate-pulse"
              : timeLeft < 60
                ? "text-amber-500"
                : "text-brand-sky"
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
              className="gap-4 text-xl px-12 py-8 h-auto rounded-full bg-brand-sky hover:bg-brand-sky/90 text-white shadow-lg hover:shadow-brand-sky/20 transition-all"
            >
              <Mic className="h-8 w-8" />
              Start Recording
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
              Stop & Submit
            </Button>
          )}
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-brand-sky mb-4" />
            <p className="text-xl font-medium text-brand-sky">
              AI panel is evaluating your response...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Analyzing clarity, structure, confidence, and relevance
            </p>
          </div>
        )}
      </Card>

      {/* Feedback Section */}
      {feedback && !isProcessing && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
          {/* Score Overview */}
          <Card className="p-8 border-brand-sky/20 shadow-xl">
            <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
              <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                Overall Performance
              </p>
              <h2 className="text-5xl font-bold mb-2">
                <span className={getScoreColor(feedback.totalScore, 100)}>
                  {feedback.totalScore}
                </span>
                <span className="text-3xl text-muted-foreground">/100</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {feedback.totalScore >= 80
                  ? "Excellent performance! 🎯"
                  : feedback.totalScore >= 60
                    ? "Good effort, keep practicing! ✈️"
                    : "Room for improvement. Review feedback below."}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {feedback.scores.map((s, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center"
                >
                  <p className="text-xs uppercase tracking-wide opacity-70 mb-2">{s.criteria}</p>
                  <p className={`text-3xl font-bold mb-1 ${getScoreColor(s.score, s.maxScore)}`}>
                    {s.score}
                  </p>
                  <p className="text-xs text-muted-foreground">/ {s.maxScore}</p>
                </div>
              ))}
            </div>

            {/* Audio Playback */}
            {audioUrl && (
              <div className="flex items-center justify-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl mb-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={togglePlayback}
                  className="gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" /> Play Recording
                    </>
                  )}
                </Button>
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Review your response</span>
              </div>
            )}

            {/* Transcript */}
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>📝</span> Transcript
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {feedback.transcript}
              </p>
            </div>

            {/* Strengths */}
            {feedback.strengths && feedback.strengths.length > 0 && (
              <div className="bg-green-50 dark:bg-green-950/40 rounded-xl p-6 border-l-4 border-green-500 mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                  <span>✅</span> Strengths
                </h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-green-800 dark:text-green-200">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements && feedback.improvements.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl p-6 border-l-4 border-amber-500 mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <span>💡</span> Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, i) => (
                    <li key={i} className="text-sm text-amber-800 dark:text-amber-200">
                      • {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Feedback */}
            <div className="bg-blue-50 dark:bg-blue-950/40 rounded-xl p-6 border-l-4 border-brand-sky">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-brand-sky">
                <span>👨‍✈️</span> Panel Feedback
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                {feedback.feedback}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={generateNewQuestion} variant="secondary" size="lg">
                Practice Another Question
              </Button>
              <Link href="/interview/history">
                <Button variant="outline" size="lg">
                  View History
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}


