import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aviationSections } from "@/lib/aviation/content";

export default function AviationPage() {
  const totalTopics = aviationSections.reduce((sum, section) => sum + section.topics.length, 0);
  const featuredSection = aviationSections[0];
  const featuredTopic = featuredSection.topics[0];

  return (
    <div className="space-y-10">
      <header className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-soft-lg dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-sky">
            Aviation Knowledge
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
            Structured study decks for cadets
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Learn fundamentals through visuals, mnemonics, and Ethiopian Airlines context. Each topic is crafted like a ground-school lesson with examples, diagrams, and quick quizzes.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="rounded-full bg-slate-100 px-4 py-1 dark:bg-slate-800">
              {aviationSections.length} sections
            </span>
            <span className="rounded-full bg-slate-100 px-4 py-1 dark:bg-slate-800">
              {totalTopics} topics
            </span>
            <span className="rounded-full bg-slate-100 px-4 py-1 dark:bg-slate-800">
              Study-ready content
            </span>
          </div>
          <div className="mt-6 flex gap-3">
            <Button asChild className="gap-2 bg-brand-sky hover:bg-brand-sky/90">
              <Link href={`/aviation/${featuredTopic.id}`}>
                <BookOpenCheck className="h-4 w-4" />
                Start with {featuredTopic.title}
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="#sections">
                <GraduationCap className="h-4 w-4" />
                Browse syllabus
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-soft-lg backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
          <Image
            src="/assets/Aviation Concept Illustration — Four Forces of Flight.png"
            alt="Four forces of flight"
            fill
            className="object-cover"
            priority
          />
        </div>
      </header>

      <section className="space-y-4" id="sections">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Curriculum overview</h2>
            <p className="text-sm text-muted-foreground">
              Move through the modules in order or jump directly to any topic you need to review.
            </p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {aviationSections.map((section) => (
            <Card key={section.id} className="border-white/60 bg-white/95 dark:border-slate-800/70 dark:bg-slate-900/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-brand-sky">Section</p>
                    <CardTitle className="mt-1 text-lg">{section.title}</CardTitle>
                  </div>
                  <Badge variant="secondary">{section.topics.length} topics</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{section.summary}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-dashed border-slate-200/70 p-3 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Featured lesson</p>
                  <Link
                    href={`/aviation/${section.topics[0].id}`}
                    className="mt-1 flex items-center justify-between text-sm font-medium text-brand-sky hover:underline"
                  >
                    {section.topics[0].title}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {section.topics.slice(1, 4).map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/aviation/${topic.id}`}
                      className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-brand-sky hover:text-brand-sky dark:border-slate-700 dark:text-slate-300"
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
                <div className="rounded-2xl bg-slate-100/80 p-4 text-sm text-slate-700 dark:bg-slate-800/40 dark:text-slate-200">
                  <p className="text-xs uppercase tracking-wide text-brand-sky">Key takeaways</p>
                  <ul className="mt-2 space-y-2 list-disc pl-5">
                    {section.topics.slice(0, 3).map((topic) => (
                      <li key={`${section.id}-${topic.id}`}>
                        <span className="font-semibold text-slate-900 dark:text-white">{topic.title}:</span>{" "}
                        {topic.summary}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How to study</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Step-by-step lessons</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Each topic includes explanations, airline examples, diagram notes, and study bullet points so you can brief or teach the concept.
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Flash-ready notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Definitions, misconceptions, and quiz questions are pre-written for rapid recall sessions or discussion with instructors.
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Interview focus</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Real-world airline scenarios are embedded so you can answer technical and situational interview questions with confidence.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
export const metadata = {
  title: "Aviation Knowledge | SkyInterview",
  description: "Learn the four forces of flight, aerodynamics, and weather basics for your pilot interview.",
};