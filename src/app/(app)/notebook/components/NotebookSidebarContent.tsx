// app/notebook/components/NotebookSidebarContent.tsx
"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Folder, FileText, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { createFolder, deleteItem, renameItem, reorderItems } from "../actions";
import type { Database } from "@/lib/supabase/types";

type NotebookItem = Database["public"]["Tables"]["notebook_pages"]["Row"];

function SortableItem({
  item,
  onRename,
  onDelete,
}: {
  item: NotebookItem;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted/70 group transition-all ${
        isDragging ? "opacity-50 z-50" : ""
      }`}
    >
      <Link
        href={item.is_folder ? "#" : `/notebook/${item.id}`}
        className="flex items-center gap-3 flex-1 min-w-0"
        {...attributes}
        {...listeners}
      >
        {item.is_folder ? (
          <Folder className="h-5 w-5 text-amber-600 flex-shrink-0" />
        ) : (
          <FileText className="h-5 w-5 text-sky-600 flex-shrink-0" />
        )}
        <span className="font-medium truncate">{item.title}</span>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const newName = prompt("Rename", item.title);
          if (newName && newName !== item.title) {
            onRename(item.id, newName);
          }
        }}
      >
        ⋯
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (confirm(`Delete "${item.title}" forever?`)) {
            onDelete(item.id);
          }
        }}
      >
        ×
      </Button>
    </div>
  );
}

export function NotebookSidebarContent({
  items,
  setItems,
}: {
  items: NotebookItem[];
  setItems: React.Dispatch<React.SetStateAction<NotebookItem[]>>;
}) {
  const [search, setSearch] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    newItems.forEach((item, idx) => (item.sort_order = idx));

    setItems(newItems);
    await reorderItems(newItems);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      <Button
        className="w-full justify-start h-10"
        variant="outline"
        onClick={async () => {
          await createFolder();
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Folder
      </Button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredItems.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onRename={async (id, title) => {
                await renameItem(id, title);
                setItems((prev) =>
                  prev.map((i) => (i.id === id ? { ...i, title } : i))
                );
              }}
              onDelete={async (id) => {
                await deleteItem(id);
                setItems((prev) => prev.filter((i) => i.id !== id));
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
