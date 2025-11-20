import { ArrowRight, Layers3, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const resources = [
  { title: "Mock question bank", count: 120, description: "HR, motivation, competency, airline-specific" },
  { title: "Audio exemplars", count: 24, description: "Model answers narrated by senior pilots" },
  { title: "Phraseology cheat sheets", count: 8, description: "NATO alphabet, ATC calls, SOP callouts" },
];

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-sky">
            Practice Library
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Content & assets hub</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse the entire interview, discussion, and knowledge content library.
          </p>
        </div>
        <Button className="gap-2" variant="outline">
          <Search className="h-4 w-4" />
          Search library
        </Button>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.title}>
            <CardContent className="space-y-3 p-6">
              <Layers3 className="h-6 w-6 text-brand-sky" />
              <div>
                <h3 className="text-lg font-semibold">{resource.title}</h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
              <p className="text-sm font-semibold text-slate-500">{resource.count} items</p>
              <Button variant="ghost" className="justify-start gap-1 text-brand-sky">
                Browse
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

