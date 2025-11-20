// app/notebook/components/NotebookEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef, useTransition } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { updateNote } from "../actions";

type Props = {
  noteId: string;
  initialContent: string;
  title: string;
};

export function NotebookEditor({ noteId, initialContent, title }: Props) {
  const [isPending, startTransition] = useTransition();
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSave = useCallback(
    (html: string) => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      saveTimeout.current = setTimeout(() => {
        startTransition(() => {
          updateNote(noteId, html);
        });
      }, 800);
    },
    [noteId, startTransition],
  );

  const editor = useEditor({
    immediatelyRender: false, // ← THIS FIXES THE SSR ERROR
    extensions: [
      StarterKit.configure({
        history: {
          depth: 50,
        },
      }),
      Highlight,
      Placeholder.configure({
        placeholder: "Start writing your pilot story…",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[60vh] p-6",
      },
    },
    onUpdate: ({ editor }) => {
      // Debounced auto-save on change
      scheduleSave(editor.getHTML());
    },
  });

  // Initial content sync (in case of refresh)
  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent, false);
    }
  }, [initialContent, editor]);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="border-t bg-muted/50 px-6 py-3 text-sm text-muted-foreground flex items-center justify-between">
        <span>{isPending ? "Saving..." : "All changes saved"}</span>
        <span>{title}</span>
      </div>
    </div>
  );
}
