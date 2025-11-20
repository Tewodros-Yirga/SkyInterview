import { createSupabaseServerClient } from "@/lib/supabase/server";

type BaseSession = {
  id: string;
  created_at: string;
};

export type CadetProgress = {
  streakDays: number;
  sessionsThisWeek: number;
  interviewCount: number;
  discussionCount: number;
  notebookCount: number;
  studySectionsCompleted: number;
  lastInterview?: {
    question: string;
    category: string;
    created_at: string;
    total_score?: number | null;
  };
  lastDiscussion?: {
    assigned_side: string;
    created_at: string;
    feedback?: string | null;
  };
  latestNotebookEntries: {
    id: string;
    title: string;
    excerpt: string;
    updated_at: string;
  }[];
  recentWins: {
    label: string;
    detail: string;
    created_at: string;
  }[];
};

function formatDateKey(date: Date) {
  return date.toISOString().split("T")[0]!;
}

function stripHtml(input: string | null | undefined) {
  if (!input) return "";
  return input.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function computeStreak(dates: string[], today = new Date()) {
  let streak = 0;
  const dateSet = new Set(dates);
  const cursor = new Date(formatDateKey(today));

  while (true) {
    const key = formatDateKey(cursor);
    if (dateSet.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export async function getCadetProgress(userId: string): Promise<CadetProgress> {
  const supabase = await createSupabaseServerClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [interviewRes, discussionRes, notebookRes] = await Promise.all([
    supabase
      .from("interview_sessions")
      .select("id, question, category, total_score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("discussion_sessions")
      .select("id, assigned_side, feedback, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("notebook_pages")
      .select("id, title, content, section, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(10),
  ]);

  const interviewData = interviewRes.data ?? [];
  const discussionData = discussionRes.data ?? [];
  const notebookData = notebookRes.data ?? [];

  const sessionsThisWeek = [...interviewData, ...discussionData].filter((session: BaseSession) => {
    const created = new Date(session.created_at);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    return created >= weekStart;
  }).length;

  const sessionDates = [...interviewData, ...discussionData].map((session) =>
    formatDateKey(new Date(session.created_at)),
  );

  const streakDays = computeStreak(sessionDates);

  const latestNotebookEntries = notebookData.slice(0, 2).map((entry) => ({
    id: entry.id,
    title: entry.title,
    excerpt: stripHtml(entry.content).slice(0, 140) + (entry.content && entry.content.length > 140 ? "…" : ""),
    updated_at: entry.updated_at,
  }));

  const sectionSet = new Set<string>();
  notebookData.forEach((entry) => {
    if (entry.section) {
      sectionSet.add(entry.section);
    }
  });

  const recentWins = [
    ...(interviewData[0]
      ? [
          {
            label: "Interview session",
            detail: `Practised "${interviewData[0].question ?? "Interview question"}"`,
            created_at: interviewData[0].created_at,
          },
        ]
      : []),
    ...(discussionData[0]
      ? [
          {
            label: "Discussion drill",
            detail: `Side: ${discussionData[0].assigned_side}`,
            created_at: discussionData[0].created_at,
          },
        ]
      : []),
    ...(notebookData[0]
      ? [
          {
            label: "Notebook entry",
            detail: `Updated "${notebookData[0].title}"`,
            created_at: notebookData[0].updated_at,
          },
        ]
      : []),
  ].slice(0, 3);

  return {
    streakDays,
    sessionsThisWeek,
    interviewCount: interviewData.length,
    discussionCount: discussionData.length,
    notebookCount: notebookData.length,
    studySectionsCompleted: sectionSet.size,
    lastInterview: interviewData[0]
      ? {
          question: interviewData[0].question ?? "Latest interview question",
          category: interviewData[0].category ?? "General",
          created_at: interviewData[0].created_at,
          total_score: interviewData[0].total_score,
        }
      : undefined,
    lastDiscussion: discussionData[0]
      ? {
          assigned_side: discussionData[0].assigned_side ?? "for",
          created_at: discussionData[0].created_at,
          feedback: discussionData[0].feedback,
        }
      : undefined,
    latestNotebookEntries,
    recentWins,
  };
}

