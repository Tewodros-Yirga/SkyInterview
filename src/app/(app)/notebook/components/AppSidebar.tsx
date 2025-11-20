// app/notebook/components/AppSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NotebookSidebarContent } from "./NotebookSidebarContent";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import type { Database } from "@/lib/supabase/types";

type NotebookItem = Database["public"]["Tables"]["notebook_pages"]["Row"];

export function AppSidebar() {
  const [items, setItems] = useState<NotebookItem[]>([]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const loadItems = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("notebook_pages")
        .select("*")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true });

      setItems(data ?? []);
    };

    loadItems();

    const { data: listener } = supabase
      .channel("notebook-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notebook_pages",
          filter: `user_id=eq.${(async () =>
            (await supabase.auth.getUser()).data.user?.id)()}`,
        },
        () => loadItems()
      )
      .subscribe();

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-6 border-b bg-gradient-to-r from-sky-600 to-blue-700 text-white">
        <h2 className="text-2xl font-bold">SkyNotebook</h2>
        <p className="text-sm opacity-90">Ethiopian Airlines Prep</p>
      </SidebarHeader>
      <SidebarContent className="bg-slate-50 dark:bg-slate-900">
        <NotebookSidebarContent items={items} setItems={setItems} />
      </SidebarContent>
    </Sidebar>
  );
}
