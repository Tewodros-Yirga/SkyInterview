import { createSupabaseServerClient } from "@/lib/supabase/server";

export type NotebookTemplate = {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  targetPath: string;
  tips: string[];
};

const FALLBACK_TEMPLATES: NotebookTemplate[] = [
  {
    title: "My Strengths",
    subtitle: "Confident pilot identity",
    description: "List technical, interpersonal, and cultural strengths backed by cockpit evidence.",
    icon: "/assets/Module Icon — Candidate Notebook.png",
    targetPath: "/notebook/strengths",
    tips: ["Link each strength to STAR stories", "Highlight Ethiopian Airlines values match"],
  },
  {
    title: "Safe Weaknesses",
    subtitle: "Growth without risk",
    description: "Craft self-awareness statements showing maturity, accountability, and mitigation.",
    icon: "/assets/Module Icon — Dashboard  Progress.png",
    targetPath: "/notebook/weaknesses",
    tips: ["Mention recovery plan", "Avoid disqualifying gaps"],
  },
  {
    title: "Competency Stories",
    subtitle: "STAR / SOARA scripts",
    description: "Capture detailed stories for CRM, leadership, conflict, discipline, adaptability.",
    icon: "/assets/Interview Coaching Illustration (STAR Method).png",
    targetPath: "/notebook/stories",
    tips: ["Use Situation, Task, Action, Result", "End with lessons learned"],
  },
  {
    title: "Self-Assessment Notes",
    subtitle: "Interview reflections",
    description: "Log feedback from mock panels, drills, and group discussions for improvement.",
    icon: "/assets/Notebook Background Texture.png",
    targetPath: "/notebook/self-assessment",
    tips: ["Record timestamp & scenario", "Add micro-goals"],
  },
];

export async function getNotebookTemplates() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("notebook_templates").select("*").order("created_at", { ascending: true });

    if (error || !data?.length) {
      return FALLBACK_TEMPLATES;
    }

    return data.map((template) => ({
      title: template.title,
      subtitle: template.subtitle,
      description: template.description,
      icon: template.icon ?? "/assets/Module Icon — Candidate Notebook.png",
      targetPath: `/notebook/${template.section}`,
      tips: template.tips ?? [],
    }));
  } catch {
    return FALLBACK_TEMPLATES;
  }
}

