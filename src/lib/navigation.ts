import type { ComponentType } from "react";
import {
  AirVent,
  BookCopy,
  ClipboardList,
  Compass,
  Headphones,
  Home,
  MessageCircle,
  NotebookPen,
  Sparkles,
  Trophy,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
};

export const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Interview Simulator", href: "/interview", icon: Headphones },
  { label: "Group Discussion", href: "/discussion", icon: MessageCircle },
  { label: "Candidate Notebook", href: "/notebook", icon: NotebookPen },
  { label: "Aviation Knowledge", href: "/aviation", icon: AirVent },
  { label: "Airline Knowledge", href: "/airline", icon: Compass },
];

export const secondaryNav: NavItem[] = [
  { label: "Practice Library", href: "/library", icon: BookCopy },
  { label: "Checklists", href: "/checklists", icon: ClipboardList },
  { label: "Coaching", href: "/coaching", icon: Sparkles, badge: "Soon" },
  { label: "Achievements", href: "/achievements", icon: Trophy, badge: "New" },
];

export type { NavItem };

