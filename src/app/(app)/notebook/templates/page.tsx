import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNotebookTemplates } from "@/lib/notebook/templates";

export const dynamic = "force-dynamic";

export default async function NotebookTemplatesPage() {
  const templates = await getNotebookTemplates();

  return (
    <div className="space-y-10 pb-16">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-sky">Notebook Templates</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Ready-made interview pages</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use structured layouts for strengths, safe weaknesses, STAR stories, and self-assessments. Each template opens a pre-filled
            note so you can start writing immediately.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/notebook/new">Create blank note</Link>
        </Button>
      </header>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.title} className="flex flex-col border-white/60 bg-white/95 dark:border-slate-800 dark:bg-slate-900/80">
            <CardHeader className="space-y-3">
              <div className="relative h-16 w-16">
                <Image src={template.icon} alt="" fill className="rounded-xl object-contain" />
              </div>
              <CardTitle>{template.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{template.subtitle}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">{template.description}</p>
              {template.tips.length ? (
                <div className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-50 p-3 text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-900/40">
                  <p className="mb-1 font-semibold text-slate-800 dark:text-white">Tips</p>
                  <ul className="list-disc space-y-1 pl-4">
                    {template.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <Button asChild className="mt-auto gap-2">
                <Link href={template.targetPath}>Use template</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

