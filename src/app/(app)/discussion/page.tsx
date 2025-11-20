"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic } from "lucide-react";
// Replaced Next.js Link with standard a tag for preview compatibility
// import Link from "next/link";

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

        <div className="pt-8">
          <a href="/discussion/session">
            <Button
              size="lg"
              className="text-xl px-12 py-8 h-auto gap-4 rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              <Mic className="w-8 h-8" />
              Start New Session
            </Button>
          </a>
        </div>

        <p className="text-sm text-muted-foreground">
          Make sure your microphone is enabled.
        </p>
      </Card>
    </div>
  );
}
