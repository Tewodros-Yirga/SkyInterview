// app/notebook/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

export default function NotebookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <SidebarTrigger className="sticky top-4 left-4 z-50 bg-white dark:bg-slate-800 shadow-lg rounded-lg" />
        <div className="p-6 pt-20 max-w-7xl mx-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
