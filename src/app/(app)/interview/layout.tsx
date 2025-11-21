import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Practice | SkyInterview",
  description: "Practice your Interview skills with AI feedback and timed questions.",
};

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}