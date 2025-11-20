"use client";

import type { User } from "@supabase/supabase-js";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { AppSidebar } from "./app-sidebar";
import { TopNav } from "./top-nav";

type SiteShellProps = {
  children: React.ReactNode;
  className?: string;
  user: User;
};

export function SiteShell({ children, className, user }: SiteShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-foreground dark:from-slate-900 dark:via-slate-950 dark:to-black",
        className
      )}
    >
      <TopNav
        onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        user={user}
      />

      <div className="flex w-full gap-6 pl-4 pr-4 pt-8 pb-10 md:pl-0 md:pr-6 lg:pr-10">
        <div className="hidden shrink-0 md:block">
          <div className="sticky top-24 mt-0">
            <AppSidebar className="w-64" />
          </div>
        </div>
        <main className="flex-1 md:max-w-5xl md:pr-4 lg:pr-10">
          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft-lg backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75">
            {children}
          </div>
        </main>
      </div>

      {mobileMenuOpen ? (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72">
            <AppSidebar
              collapsed={false}
              className="h-full border-r-0 shadow-soft-lg"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
