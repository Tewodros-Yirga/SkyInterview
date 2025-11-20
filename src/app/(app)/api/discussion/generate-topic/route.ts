import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FALLBACK_TOPICS = [
  {
    topic: "The captain's decision should be final, even if the crew disagrees.",
    side: "against" as const,
  },
  {
    topic: "Cadets should learn on glass cockpits before touching analog gauges.",
    side: "for" as const,
  },
  {
    topic: "Airlines should allow AI co-pilots on training flights within 5 years.",
    side: "against" as const,
  },
  {
    topic: "Fuel efficiency targets should trump tight schedules when conditions change.",
    side: "for" as const,
  },
];

function fallbackTopic() {
  return FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";

  if (!apiKey) {
    console.warn("Gemini API key missing. Returning static topic.");
    return NextResponse.json(fallbackTopic());
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Generate exactly ONE controversial debate topic. The topics could be anything, However they need to be debatable, Make the questions simple, not that hard but debatable. It should not be more than just 7 words or so.The questions could be from anywhere technology, history or anything.
Return strictly valid JSON: { "topic": "string", "side": "for" | "against" }`;

    const result = await model.generateContent([{ text: prompt }]);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const json = JSON.parse(text);

    const topic =
      typeof json.topic === "string" && json.topic.trim().length > 0
        ? json.topic.trim()
        : fallbackTopic().topic;
    const side = json.side === "against" ? "against" : "for";

    return NextResponse.json({ topic, side });
  } catch (error) {
    console.error("Generate Topic API Error:", error);
    return NextResponse.json(fallbackTopic());
  }
}