import { getCadetProgress } from "@/lib/practice/progress";

export type DashboardStat = {
  label: string;
  value: string;
  change?: string;
};

export type PracticeHistory = {
  question: string;
  category: string;
  practicedAt: string;
};

export type DiscussionHistory = {
  topic: string;
  practicedAt: string;
  feedback: string;
};

export type NotebookHighlight = {
  title: string;
  excerpt: string;
};

export type KnowledgeTrack = {
  title: string;
  progress: number;
  segment: string;
};

export type DashboardSummary = {
  stats: DashboardStat[];
  interview: PracticeHistory;
  discussion: DiscussionHistory;
  notebook: NotebookHighlight[];
  knowledge: KnowledgeTrack[];
};

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const progress = await getCadetProgress(userId);

  const stats: DashboardStat[] = [
    {
      label: "Sessions this week",
      value: progress.sessionsThisWeek.toString(),
      change: progress.streakDays > 0 ? `${progress.streakDays}-day streak` : "Start your streak today",
    },
    {
      label: "Notebook entries",
      value: progress.notebookCount.toString(),
      change: progress.latestNotebookEntries[0]
        ? `Last update · ${new Date(progress.latestNotebookEntries[0].updated_at).toLocaleDateString()}`
        : "Add your first entry",
    },
    {
      label: "Interview recordings",
      value: progress.interviewCount.toString(),
      change: progress.lastInterview ? "Latest session logged" : "No recordings yet",
    },
  ];

  const interview: PracticeHistory = progress.lastInterview
    ? {
        question: progress.lastInterview.question,
        category: progress.lastInterview.category,
        practicedAt: new Date(progress.lastInterview.created_at).toLocaleString(),
      }
    : {
        question: "No interview sessions yet",
        category: "Start a mock panel",
        practicedAt: "",
      };

  const discussion: DiscussionHistory = progress.lastDiscussion
    ? {
        topic: progress.lastDiscussion.topic ?? `Side: ${progress.lastDiscussion.assigned_side}`,
        practicedAt: new Date(progress.lastDiscussion.created_at).toLocaleString(),
        feedback: progress.lastDiscussion.feedback ?? "Review notes available in discussion history.",
      }
    : {
        topic: "No discussion drills yet",
        practicedAt: "",
        feedback: "Run a cockpit debate to unlock feedback.",
      };

  const notebook: NotebookHighlight[] =
    progress.latestNotebookEntries.length > 0
      ? progress.latestNotebookEntries.map((entry) => ({
          title: entry.title,
          excerpt: entry.excerpt,
        }))
      : [
          {
            title: "Notebook empty",
            excerpt: "Start by outlining your strengths and STAR stories.",
          },
        ];

  const knowledge: KnowledgeTrack[] = [
    {
      title: "Aviation + Airline briefs",
      progress: Math.min(100, progress.studySectionsCompleted * 15),
      segment: `${progress.studySectionsCompleted} sections documented`,
    },
    {
      title: "Interview recordings",
      progress: Math.min(100, progress.interviewCount * 10),
      segment: `${progress.interviewCount} saved sessions`,
    },
    {
      title: "Discussion drills",
      progress: Math.min(100, progress.discussionCount * 10),
      segment: `${progress.discussionCount} debates logged`,
    },
  ];

  return {
    stats,
    interview,
    discussion,
    notebook,
    knowledge,
  };
}

