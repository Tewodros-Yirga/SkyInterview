"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { History, Mic } from "lucide-react";

export default function DiscussionLobby() {
  return (
    <div className="max-w-4xl mx-auto p-6 py-20">
      <Card className="p-12 text-center space-y-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 border-amber-100 dark:border-amber-900">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-950 dark:text-amber-500">
            Cockpit Discussion
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice your communication, assertiveness, and command presence
            with our AI Captain. You will be given a topic and judged on your
            argument.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="text-xl px-12 py-8 h-auto gap-4 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            <Link href="/discussion/session">
              <Mic className="w-8 h-8" />
              Start New Session
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-3 border-amber-200 text-amber-900 dark:text-amber-400">
            <Link href="/discussion/history">
              <History className="h-5 w-5" />
              View History
            </Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Make sure your microphone is enabled.
        </p>
      </Card>
    </div>
  );
}

export const metadata = {
  title: "Aviation discussion | SkyInterview",
  description: "Master discussion with SkyInterview",
};