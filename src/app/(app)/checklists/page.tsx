import { CheckCircle2, ClipboardList, Headphones, Mic, Shirt, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Checklist = {
  title: string;
  category: string;
  duration: string;
  steps: string[];
  tips: string[];
  icon: React.ComponentType<{ className?: string }>;
};

const checklists: Checklist[] = [
  {
    title: "Mock Panel Readiness",
    category: "Interview",
    duration: "15 min",
    icon: Mic,
    steps: [
      "Review today’s question set and align on STAR structure.",
      "Skim airline & aviation quick facts for warm-up.",
      "Run through opening pitch + strength highlight aloud.",
      "Check environment: background, lighting, camera angle.",
      "Start recording or join call 5 minutes early.",
    ],
    tips: ["Keep water and notebook nearby.", "Pin 3 key metrics on a sticky note for quick reference."],
  },
  {
    title: "Audio & Hardware Setup",
    category: "Tech",
    duration: "8 min",
    icon: Headphones,
    steps: [
      "Reconnect USB mic/headset; confirm system input/output.",
      "Run 15-second test recording, listen for noise or clipping.",
      "Disable notifications and heavy background apps.",
      "Check upload speed (>10 Mbps) or switch to wired connection.",
      "Open SkyInterview + notes only to reduce CPU load.",
    ],
    tips: ["Have a backup wired earphone ready.", "Label cables so you can swap quickly if issues occur."],
  },
  {
    title: "Uniform & Grooming",
    category: "Professionalism",
    duration: "10 min",
    icon: Shirt,
    steps: [
      "Press shirt/blazer; ensure collar sits flat on camera.",
      "Neutral background, camera at eye level, soft lighting.",
      "Check grooming: hair neat, nails trimmed, badges aligned.",
      "Lay out watch, pen, ID, and spare battery pack.",
    ],
    tips: ["Stick to solid colors to avoid camera flicker.", "Practice posture and smile right before you go live."],
  },
];

export default function ChecklistsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-sky">Checklists</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Stay disciplined like the cockpit</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Quick, repeatable flows you can run before every simulator, interview, or coaching session.
          </p>
        </div>
        <ClipboardList className="hidden h-12 w-12 text-brand-sky/70 md:block" />
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {checklists.map((checklist) => (
          <Card
            key={checklist.title}
            className="flex flex-col border-white/60 bg-white/95 shadow-soft-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <checklist.icon className="h-4 w-4 text-brand-sky" />
                  {checklist.category}
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Timer className="h-3.5 w-3.5" />
                  {checklist.duration}
                </span>
              </div>
              <CardTitle className="text-lg">{checklist.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4">
              <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {checklist.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="font-semibold text-brand-sky">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-50 p-3 text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-900/40">
                <p className="mb-1 font-semibold text-slate-800 dark:text-white">Pro tips</p>
                <ul className="list-disc space-y-1 pl-4">
                  {checklist.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
              <Button variant="outline" className="mt-auto gap-2 text-brand-sky">
                <CheckCircle2 className="h-4 w-4" />
                Mark complete
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
