import { ArrowRight, ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const checklists = [
  { title: "Mock panel readiness", steps: 12 },
  { title: "Audio & hardware setup", steps: 7 },
  { title: "Uniform & grooming", steps: 9 },
];

export default function ChecklistsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-sky">
            Checklists
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Stay disciplined like the cockpit</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Follow structured lists before interviews, discussions, and simulator drills.
          </p>
        </div>
        <ClipboardList className="hidden h-12 w-12 text-brand-sky/70 md:block" />
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {checklists.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{item.steps} steps</p>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="gap-1 text-brand-sky">
                Open checklist
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

