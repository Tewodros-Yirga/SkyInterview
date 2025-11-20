export type DashboardStat = {
  label: string;
  value: string;
  change?: string;
};

export type PracticeHistory = {
  question: string;
  category: string;
  practicedAt: string;
  durationSeconds: number;
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

const FALLBACK_SUMMARY: DashboardSummary = {
  stats: [
    { label: "Sessions this week", value: "5", change: "+2 vs last week" },
    { label: "Notebook entries", value: "18", change: "Last update · 2h ago" },
    { label: "Consistency streak", value: "7 days", change: "Daily cockpit drills" },
  ],
  interview: {
    question: "Walk me through a time you handled an unexpected change during training.",
    category: "Competency · CRM",
    practicedAt: "Today · 09:40",
    durationSeconds: 210,
  },
  discussion: {
    topic: "Balancing assertiveness with crew harmony inside the cockpit",
    practicedAt: "Yesterday · 18:10",
    feedback: "Great clarity. Build a stronger closing statement.",
  },
  notebook: [
    {
      title: "My Strengths",
      excerpt: "Calm under time pressure, structured STAR communication, strong METAR decoding confidence.",
    },
    {
      title: "Competency Stories",
      excerpt: "Handled unexpected diversion in simulator by recalculating fuel and briefing crew within 45 seconds.",
    },
  ],
  knowledge: [
    { title: "Aviation Basics", progress: 70, segment: "Lift & Drag families" },
    { title: "Ethiopian Airlines Insights", progress: 45, segment: "Fleet + Training pillars" },
    { title: "ATC Phraseology", progress: 30, segment: "Approach & holding calls" },
  ],
};

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  // Placeholder implementation. When Supabase tables are ready, replace this with real queries.
  void userId;
  return FALLBACK_SUMMARY;
}

