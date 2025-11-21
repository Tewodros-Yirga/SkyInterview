import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const CAPABILITIES = [
  "Explain aviation or airline knowledge stored in the platform",
  "Give coaching tips for interview and group discussion questions",
  "Help navigate SkyInterview modules and data",
  "Suggest notebook prompts or structure answers using STAR",
].join("\n- ");

function sanitizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const content: string = body?.message;

  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const trimmedContent = content.trim();

  type AIMessageInsert = {
    user_id: string;
    role: "user" | "assistant";
    content: string;
  };

  const insertUserMessage = await (supabase
    .from("ai_messages") as unknown as {
      insert: (values: AIMessageInsert) => {
        select: (columns: string) => {
          single: () => Promise<{ data: { id: string; created_at: string } | null; error: Error | null }>;
        };
      };
    })
    .insert({ user_id: user.id, role: "user" as const, content: trimmedContent })
    .select("id, created_at")
    .single();

  if (insertUserMessage.error) {
    console.error("AI insert user message error:", insertUserMessage.error);
    return NextResponse.json({ error: "Unable to save your message" }, { status: 500 });
  }

  type AIMessageRow = {
    role: "user" | "assistant";
    content: string;
  };

  const { data: history } = await (supabase
    .from("ai_messages") as unknown as {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          order: (column: string, options: { ascending: boolean }) => {
            limit: (count: number) => Promise<{ data: AIMessageRow[] | null; error: Error | null }>;
          };
        };
      };
    })
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(12);

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";

  if (!apiKey) {
    return NextResponse.json({
      message:
        "I’m offline right now because no AI key is configured. Please try again later or contact support.",
    });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const systemPrompt = `You are SkyInterview Copilot, an AI mentor for Ethiopian Airlines cadets using the SkyInterview platform.
You can:
- ${CAPABILITIES}
Guide users with concise, encouraging answers (under 180 words when possible), reference platform modules by URL when helpful, and suggest actionable next steps.
If you don't have the requested data, say so honestly and guide them to the closest module.`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  type HistoryMessage = { role: "user" | "assistant"; content: string };
  const historyParts =
    (history as HistoryMessage[] | null)?.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: sanitizeText(msg.content) }],
    })) ?? [];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }, ...historyParts],
    });

    const responseText = sanitizeText(result.response?.text?.() ?? "");

    const answer =
      responseText ||
      "I couldn't generate a helpful answer right now. Please try again in a moment.";

    const insertAssistantMessage = await (supabase
      .from("ai_messages") as unknown as {
        insert: (values: AIMessageInsert) => {
          select: (columns: string) => {
            single: () => Promise<{ data: { id: string; created_at: string } | null; error: Error | null }>;
          };
        };
      })
      .insert({ user_id: user.id, role: "assistant" as const, content: answer })
      .select("id, created_at")
      .single();

    if (insertAssistantMessage.error) {
      console.error("AI insert assistant message error:", insertAssistantMessage.error);
    }

    return NextResponse.json({ message: answer });
  } catch (error) {
    console.error("AI send error:", error);
    return NextResponse.json({
      message: "The AI model is currently unavailable. Please try again shortly.",
    });
  }
}

