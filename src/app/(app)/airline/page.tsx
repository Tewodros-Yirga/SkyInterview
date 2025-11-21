import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building, PlaneTakeoff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { airlineSections } from "@/lib/airline/content";

export default function AirlinePage() {
  const totalTopics = airlineSections.reduce((sum, section) => sum + section.topics.length, 0);
  const featuredSection = airlineSections.find((section) => section.id === "ethiopian-airlines") ?? airlineSections[0];
  const featuredTopic = featuredSection.topics[0];

  return (
    <div className="space-y-10">
      <header className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-soft-lg dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">
            Airline Knowledge
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
            Speak fluently about airlines & Ethiopian
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Master global industry structure, regulatory language, operations, and Ethiopian Airlines specifics. Built for cadet and
            interview prep.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-full bg-white/70 px-4 py-1 dark:bg-slate-800/70">{airlineSections.length} sections</span>
            <span className="rounded-full bg-white/70 px-4 py-1 dark:bg-slate-800/70">{totalTopics} topics</span>
            <span className="rounded-full bg-white/70 px-4 py-1 dark:bg-slate-800/70">Interview-ready</span>
          </div>
          <div className="mt-6 flex gap-3">
            <Button asChild className="gap-2 bg-brand-gold text-brand-cockpit hover:bg-brand-gold/90">
              <Link href={`/airline/${featuredTopic.id}`}>
                <Building className="h-4 w-4" />
                Start with {featuredTopic.title}
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="#sections">
                <PlaneTakeoff className="h-4 w-4" />
                Browse modules
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-soft-lg backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
          <Image
            src="/assets/Ethiopian Airlines Fleet Illustration.png"
            alt="Ethiopian Airlines fleet"
            fill
            className="object-cover"
            priority
          />
        </div>
      </header>

      <section className="space-y-4" id="sections">
        <h2 className="text-xl font-semibold">Curriculum overview</h2>
        <p className="text-sm text-muted-foreground">
          Industry knowledge, safety, Ethiopian Airlines, finance, and interview prep—each topic reads like a ground-school lesson.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {airlineSections.map((section) => (
            <Card key={section.id} className="border-white/60 bg-white/95 dark:border-slate-800/70 dark:bg-slate-900/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">Section</p>
                    <CardTitle className="mt-1 text-lg">{section.title}</CardTitle>
                  </div>
                  <Badge variant="outline">{section.topics.length} topics</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{section.summary}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-dashed border-slate-200/70 p-3 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Featured lesson</p>
                  <Link
                    href={`/airline/${section.topics[0].id}`}
                    className="mt-1 flex items-center justify-between text-sm font-medium text-brand-gold hover:underline"
                  >
                    {section.topics[0].title}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {section.topics.slice(1, 4).map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/airline/${topic.id}`}
                      className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-brand-gold hover:text-brand-gold dark:border-slate-700 dark:text-slate-300"
                    >
                      {topic.title}
                    </Link>
                  ))}
                  {section.topics.length > 4 ? (
                    <span className="rounded-full border border-dashed border-slate-200 px-3 py-1 text-slate-400 dark:border-slate-700">
                      +{section.topics.length - 4} more
                    </span>
                  ) : null}
                </div>
                <div className="rounded-2xl bg-slate-50/80 p-4 text-sm text-slate-700 dark:bg-slate-800/40 dark:text-slate-200">
                  <p className="text-xs uppercase tracking-wide text-brand-gold">What you’ll learn</p>
                  <ul className="mt-2 space-y-2 list-disc pl-5">
                    {section.topics.slice(0, 3).map((topic) => (
                      <li key={`${section.id}-${topic.id}`}>
                        <span className="font-semibold text-slate-900 dark:text-white">{topic.title}:</span> {topic.intro}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: "Ethiopian Airlines History & Fleet | SkyInterview",
  description: "Detailed guide on Ethiopian Airlines fleet, vision, mission, and history for interview preparation.",
};