import { moduleNavItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function SideNav() {
  return (
    <aside className="hidden w-64 flex-col border-r border-border/60 bg-cockpit-gradient text-muted-foreground md:flex">
      <div className="flex flex-col gap-2 px-4 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold/80">
          Modules
        </p>
        <span className="text-sm text-muted-foreground/80">
          Structured pilot prep curated for Ethiopian Airlines interviews.
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {moduleNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all hover:bg-white/10 hover:text-white",
              item.href === "/" && "bg-white/10 text-white shadow-soft-lg",
            )}
          >
            <span className="flex items-center gap-3">
              <item.icon className="h-4 w-4 opacity-80" />
              {item.label}
            </span>
            {item.badge ? (
              <span className="rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold">
                {item.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
      <div className="px-4 pb-6">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 text-xs text-white shadow-soft-lg">
          <p className="font-semibold text-sm">Prep Tip</p>
          <p className="mt-2 text-white/80">
            Record yourself answering HR + motivation questions daily. Review tone,
            pace, and filler words to stay sharp.
          </p>
        </div>
      </div>
    </aside>
  );
}

