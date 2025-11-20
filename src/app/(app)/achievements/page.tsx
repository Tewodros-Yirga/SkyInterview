import { Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const achievements = [
  { title: "Consistency streak", value: "7 days", description: "Completed a simulator or discussion drill daily." },
  { title: "Notebook curator", value: "18 entries", description: "Strengths, weaknesses, and stories organized." },
  { title: "Knowledge navigator", value: "3 chapters", description: "Finished aviation basics modules." },
];

export default function AchievementsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3">
        <Trophy className="h-10 w-10 text-brand-gold" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">
            Achievements
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Celebrate disciplined cadet habits
          </h1>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {achievements.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <p className="text-2xl font-semibold text-brand-gold">{item.value}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

