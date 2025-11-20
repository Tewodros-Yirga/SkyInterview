import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CoachingPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-sky">
          Coaching (Coming Soon)
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Mentor feedback loops</h1>
        <p className="text-sm text-muted-foreground">
          Plan for booking live review sessions with instructors and getting annotated feedback.
        </p>
      </header>

      <Card className="border-dashed border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/60">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Live mentor pool</CardTitle>
            <p className="text-sm text-muted-foreground">
              Schedule 1:1 or small-group coaching with Ethiopian Airlines alumni.
            </p>
          </div>
          <Sparkles className="h-10 w-10 text-brand-sky/70" />
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Features planned:</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Annotated transcripts + score cards</li>
            <li>Goal tracking per mentor</li>
            <li>Video call integrations</li>
          </ul>
          <Button asChild variant="outline" className="gap-1">
            <Link href="/contact">
              Join waitlist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

