"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

type AiMessage = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

const CAPABILITY_BULLETS = [
  "Summarize aviation & airline knowledge modules",
  "Coach you on HR, motivation, and STAR answers",
  "Give tactics for group discussion & interview delivery",
  "Help navigate SkyInterview (notebook, simulator, history)",
];

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
        if (viewport) {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
        }
      }
    });
  };

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    setError(null);
    try {
      const res = await fetch("/api/assistant/history", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Unable to load history");
      }
      const data = await res.json();
      setMessages(data.messages ?? []);
      initializedRef.current = true;
      scrollToBottom();
    } catch (err) {
      console.error(err);
      setError("Unable to load assistant history. Please try again.");
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (open && !initializedRef.current) {
      loadHistory();
    }
  }, [open, loadHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMessage: AiMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "…" }]);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/assistant/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();
      setMessages((prev) => {
        const next = [...prev];
        const lastIndex = next.findIndex((msg, idx) => idx === next.length - 1 && msg.role === "assistant" && msg.content === "…");
        if (lastIndex !== -1) {
          next[lastIndex] = { role: "assistant", content: data.message || "I couldn't respond right now." };
        } else {
          next.push({ role: "assistant", content: data.message || "I couldn't respond right now." });
        }
        return next;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((msg) => msg.content !== "…"));
      setError("The AI is unavailable right now. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    setError(null);
    try {
      const res = await fetch("/api/assistant/history", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMessages([]);
    } catch (err) {
      console.error(err);
      setError("Unable to clear history right now.");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-brand-gold text-brand-gold hover:bg-brand-gold/20"
        onClick={() => setOpen(true)}
      >
        <Sparkles className="h-4 w-4" />
        AI Copilot
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] flex flex-col pb-6 gap-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">SkyInterview AI Copilot</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Ask for interview coaching, aviation knowledge summaries, or help navigating the platform.
            </p>
          </DialogHeader>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>AI responses are suggestions—use your judgment.</span>
            <button className="inline-flex items-center gap-1 text-red-500" onClick={handleClear}>
              <Trash2 className="h-3.5 w-3.5" />
              Clear history
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Capabilities</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {CAPABILITY_BULLETS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div ref={scrollAreaRef} className="flex-1 min-h-0">
            <ScrollArea className="h-full rounded-2xl border border-slate-200/70 dark:border-slate-800">
              <div className="p-4">
              {loadingHistory ? (
                <div className="flex h-full items-center justify-center text-muted-foreground min-h-[200px]">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading history...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">Ask your first question to start a conversation.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}-${message.content.slice(0, 8)}`}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                          message.role === "user"
                            ? "bg-brand-sky text-white shadow-lg"
                            : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </ScrollArea>
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <div className="mt-auto pt-4 border-t">
            <form
              className="flex gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                handleSend();
              }}
            >
              <Input
                placeholder="Ask anything about interviews, discussions, or aviation..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
                className="flex-1"
              />
              <Button type="submit" disabled={sending || !input.trim()} className="gap-2">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

