import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Discussion Practice | SkyInterview",
  description: "Practice your group discussion skills with AI feedback and timed topics.",
};

export default function DiscussionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}