import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/logo";
import Image from "next/image";

export function MainNav() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border/60 bg-white/60 px-4 py-3 backdrop-blur-md dark:bg-slate-900/60">
      <div className="flex flex-1 items-center gap-3">
        <Button size="icon" variant="ghost" className="md:hidden">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
        <BrandLogo compact />
        <div className="relative hidden flex-1 items-center md:flex">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search modules, tips, recordings..."
            className="w-full rounded-2xl border border-transparent bg-secondary px-10 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:bg-white focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" className="hidden text-xs font-semibold uppercase tracking-wider md:inline-flex">
          Resume Flow
        </Button>
        <button className="flex items-center gap-2 rounded-full border border-border/60 bg-white px-2 py-1 shadow-soft-lg">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src="/assets/Placeholder Avatars (8 variations).png"
              alt="Pilot avatar"
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div className="hidden text-left text-xs md:block">
            <p className="font-semibold text-foreground">Cadet Tizazu</p>
            <p className="text-muted-foreground">Class of 2025</p>
          </div>
        </button>
      </div>
    </header>
  );
}

