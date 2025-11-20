import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-slate-50/90 dark:bg-slate-950 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative hidden overflow-hidden lg:flex">
        <Image
          src="/assets/Landing Page Hero Illustration.png"
          alt="SkyInterview cockpit prep"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cockpit/70 via-brand-base/70 to-slate-950" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/assets/SkyInterview Horizontal Logo_bgremoved.png"
                alt="SkyInterview logo"
                width={200}
                height={48}
              />
            </Link>
            <p className="mt-6 max-w-md text-lg text-white/90">
              “SkyInterview keeps every HR, competency, and technical answer aligned with
              Ethiopian Airlines expectations. Practice speeches, organize stories, and
              study aircraft knowledge in one studio.”
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold uppercase tracking-[0.3em] text-brand-gold">
              Trusted Modules
            </p>
            <ul className="space-y-1 text-white/80">
              <li>• AI Interview Simulator with audio feedback</li>
              <li>• Group discussion timing coach</li>
              <li>• Candidate notebook with templates</li>
              <li>• Aviation & airline knowledge libraries</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/70 bg-white/90 p-10 shadow-soft-lg backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/80">
          {children}
        </div>
      </div>
    </div>
  );
}

