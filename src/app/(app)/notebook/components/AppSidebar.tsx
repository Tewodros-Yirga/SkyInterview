// app/notebook/components/AppSidebar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
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
  const channelRef = useRef<ReturnType<ReturnType<typeof createSupabaseBrowserClient>["channel"]> | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let isMounted = true;

    const loadItems = async (userId: string) => {
      const { data } = await supabase
        .from("notebook_pages")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order", { ascending: true });

      if (isMounted) {
        setItems(data ?? []);
      }
    };

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) return;

      await loadItems(user.id);

      channelRef.current = supabase
        .channel("notebook-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notebook_pages",
            filter: `user_id=eq.${user.id}`,
          },
          () => loadItems(user.id)
        )
        .subscribe();
    };

    init();

    return () => {
      isMounted = false;
      channelRef.current?.unsubscribe();
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
