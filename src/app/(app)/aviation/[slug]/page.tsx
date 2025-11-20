import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { aviationSections, aviationTopics, getAviationTopic, getSectionById } from "@/lib/aviation/content";

type AviationTopicPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return aviationTopics.map((topic) => ({ slug: topic.id }));
}

export default async function AviationTopicPage({ params }: AviationTopicPageProps) {
  const { slug } = await params;
  const topic = getAviationTopic(slug);
  if (!topic) {
    notFound();
  }

  const section = getSectionById(topic.sectionId);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden rounded-3xl border border-white/70 bg-white/90 p-5 shadow-soft-lg dark:border-slate-800/70 dark:bg-slate-900/80 lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Syllabus</p>
        <nav className="mt-4 space-y-6 text-sm">
          {aviationSections.map((sec) => (
            <div key={sec.id}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{sec.title}</p>
              <div className="space-y-1.5">
                {sec.topics.map((item) => {
                  const isActive = item.id === topic.id;
                  return (
                    <Link
                      key={item.id}
                      href={`/aviation/${item.id}`}
                      className={`block rounded-xl px-3 py-2 transition ${
                        isActive
                          ? "bg-brand-sky/10 text-brand-sky"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/60"
                      }`}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/aviation">
              <ArrowLeft className="h-4 w-4" />
              Aviation home
            </Link>
          </Button>
          {section ? <Badge variant="secondary">Section: {section.title}</Badge> : null}
        </div>

        <Card className="border-white/70 bg-white/95 shadow-soft-lg dark:border-slate-800/70 dark:bg-slate-900/80">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-sky">Lesson</p>
            <CardTitle className="text-3xl">{topic.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{topic.summary}</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <section className="space-y-3">
              {topic.description.map((paragraph, idx) => (
                <p key={idx} className="text-base leading-relaxed text-slate-700 dark:text-slate-200">
                  {paragraph}
                </p>
              ))}
            </section>

            {topic.examples.length ? (
              <section>
                <h3 className="text-lg font-semibold">Real airline examples</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {topic.examples.map((example, idx) => (
                    <li key={idx}>{example}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {topic.diagram ? (
              <section className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Diagram guidance</h3>
                <p className="mt-2">{topic.diagram}</p>
              </section>
            ) : null}

            {topic.studyPoints.length ? (
              <section>
                <h3 className="text-lg font-semibold">Study bullets</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {topic.studyPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {topic.definitions.length ? (
              <section>
                <h3 className="text-lg font-semibold">Key definitions</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {topic.definitions.map((definition) => (
                    <Card key={definition.term} className="border-slate-200 dark:border-slate-800">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{definition.term}</p>
                        <p className="text-sm text-muted-foreground">{definition.definition}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            {topic.misconceptions.length ? (
              <section>
                <h3 className="text-lg font-semibold">Common misconceptions</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {topic.misconceptions.map((misconception, idx) => (
                    <li key={idx}>{misconception}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {topic.quiz.length ? (
              <section>
                <h3 className="text-lg font-semibold">Quick quiz</h3>
                <div className="mt-3 space-y-3">
                  {topic.quiz.map((item, idx) => (
                    <details
                      key={idx}
                      className="rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40"
                    >
                      <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {item.question}
                      </summary>
                      <p className="mt-2 text-sm text-brand-sky">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

