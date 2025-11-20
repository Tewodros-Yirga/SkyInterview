"use client";

import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, Mic, User2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AiAssistant } from "@/components/ai/assistant-modal";

type TopNavProps = {
  onMenuToggle?: () => void;
  user: User;
};

export function TopNav({ onMenuToggle, user }: TopNavProps) {
  const [loadingSession, setLoadingSession] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch {
      return null;
    }
  }, []);

  const handleStartSession = () => {
    setLoadingSession(true);
    setTimeout(() => setLoadingSession(false), 800);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = user.email?.charAt(0).toUpperCase() ?? "P";

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/60 bg-white/90 px-4 shadow-sm backdrop-blur dark:bg-slate-950/70">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-transparent bg-transparent p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky md:hidden"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/SkyInterview Main Logo_bgremoved.png"
            alt="SkyInterview"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <div className="hidden flex-col leading-tight md:flex">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              SkyInterview
            </span>
            <span className="text-xs text-muted-foreground">Pilot Readiness Studio</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 border-brand-gold text-brand-gold hover:bg-brand-gold/20 ",
            loadingSession && "pointer-events-none opacity-70",
          )}
          onClick={handleStartSession}
        >
          <Mic className="h-4 w-4" />
          {loadingSession ? "Preparing..." : "Start Session"}
        </Button>
        <AiAssistant />
        <ThemeToggle />
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:text-slate-200 md:flex">
          <span>Stage</span>
          <span className="rounded-full bg-brand-sky/10 px-2 py-0.5 text-brand-sky">
            Phase 1
          </span>
        </div>
        <div className="hidden items-center gap-3 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:text-slate-200 lg:flex">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-sky/15 text-sm font-semibold text-brand-sky">
            {initials}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">Pilot</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-white">
              {user.email ?? "Active user"}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          disabled={signingOut || !supabase}
          aria-label="Sign out"
        >
          {signingOut ? (
            <User2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : (
            <LogOut className="h-4 w-4 text-slate-500" />
          )}
        </Button>
      </div>
    </header>
  );
}

