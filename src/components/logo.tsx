import Image from "next/image";
import Link from "next/link";

const LOGO_PATH = "/assets/SkyInterview Main Logo_bgremoved.png";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-lg px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative h-9 w-9 overflow-hidden rounded-full bg-brand-cockpit/10 ring-1 ring-white/20">
        <Image
          src={LOGO_PATH}
          alt="SkyInterview"
          fill
          sizes="36px"
          className="object-contain drop-shadow-sm"
        />
      </div>
      {!compact && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-sky">
            SkyInterview
          </span>
          <span className="text-xs text-muted-foreground">
            Pilot Readiness Studio
          </span>
        </div>
      )}
    </Link>
  );
}

