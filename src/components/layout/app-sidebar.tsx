"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { primaryNav, secondaryNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  collapsed?: boolean;
  className?: string;
};

export function AppSidebar({ collapsed, className }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border/70 bg-white/95 px-3 py-6 text-sm shadow-sm dark:bg-slate-950/80",
        collapsed ? "hidden md:flex" : "flex",
        className,
      )}
    >
      <nav className="space-y-6">
        <NavSection title="Core Modules" items={primaryNav} pathname={pathname} />
        <NavSection title="Practice Toolkit" items={secondaryNav} pathname={pathname} />
      </nav>
      <div className="mt-auto rounded-2xl border border-brand-sky/20 bg-brand-sky/5 p-3">
        <p className="text-xs font-medium uppercase text-brand-sky">Next Milestone</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-100">Mock panel prep</p>
        <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-sky hover:text-brand-sky/80">
          View checklist
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

type NavSectionProps = {
  title: string;
  items: typeof primaryNav;
  pathname: string | null;
};

function NavSection({ title, items, pathname }: NavSectionProps) {
  return (
    <div>
      <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <div className="mt-2 space-y-1.5">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2 transition-colors",
                isActive
                  ? "bg-brand-sky/10 text-brand-sky"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/60",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </span>
              {item.badge ? (
                <span className="rounded-full bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white dark:bg-slate-100 dark:text-slate-900">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

