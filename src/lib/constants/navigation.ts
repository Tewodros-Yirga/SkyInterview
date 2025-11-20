import { type LucideIcon, LayoutDashboard, MicVocal, NotebookText, UsersRound, PlaneTakeoff, GraduationCap } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export const moduleNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Interview Simulator",
    href: "/interview",
    icon: MicVocal,
    badge: "Live",
  },
  {
    label: "Group Discussion",
    href: "/group-discussion",
    icon: UsersRound,
  },
  {
    label: "Candidate Notebook",
    href: "/notebook",
    icon: NotebookText,
  },
  {
    label: "Aviation Knowledge",
    href: "/aviation-knowledge",
    icon: GraduationCap,
  },
  {
    label: "Airline Knowledge",
    href: "/airline-knowledge",
    icon: PlaneTakeoff,
  },
];

