import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type FallbackSide = "for" | "against";

const fallbackFeedback = (topic: string, side: FallbackSide) => ({
  transcript: "AI evaluation unavailable. Please ensure the Gemini API key is configured.",
  totalScore: 60,
  scores: [
    { criteria: "Clarity & Structure", score: 12 },
    { criteria: "Respectful Challenge", score: 12 },
    { criteria: "Use of Examples", score: 12 },
    { criteria: "Confidence & Tone", score: 12 },
    { criteria: "Conclusion Strength", score: 12 },
  ],
  feedback: `We couldn't reach the AI judge, but keep practicing your "${topic}" argument (${
    side.toUpperCase()
  }) and retry once the key is set.`,
});

const sanitizeJson = (text: string) => text.replace(/```json|```/g, "").trim();

export const POST = async (req: Request) => {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
  let topic = "unknown";
  let side: FallbackSide = "for";

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    topic = ((formData.get("topic") as string) || topic).trim() || topic;
    side =
      ((formData.get("side") as FallbackSide) || side).trim() === "against"
        ? "against"
        : "for";

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: "No audio detected" }, { status: 400 });
    }

    if (!apiKey) {
      console.warn("Gemini API key missing. Returning fallback feedback.");
      return NextResponse.json(fallbackFeedback(topic, side));
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBytes = Buffer.from(arrayBuffer);
    const base64Audio = audioBytes.toString("base64");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `You are a senior Ethiopian Airlines captain and an English expert judging a candidate pilot cadet. You have to be tough, giving honest feedback, no sugarcoating. The cadet is given 2 minutes, should be able to use the given time wisely. You are trying to teach him how to argue and how to be better at it, not to just give him a score and make him feel good. Don't give out scores, give out detailed feedback and improvements. Be harsh, You are trying to make him better, not make him feel good.
Topic: "${topic}"
Side to argue: ${side}.
Evaluate on 0-20 for each: Clarity & Structure, Respectful Challenge, Use of Examples, Confidence & Tone, Conclusion Strength.
Return ONLY valid JSON matching this shape:
{
  "transcript": "text",
  "totalScore": 85,
  "scores": [
    { "criteria": "Clarity & Structure", "score": 18 },
    ...
  ],
  "feedback": "actionable feedback."
}`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: audioFile.type || "audio/webm",
          data: base64Audio,
        },
      },
    ]);

    const responseText = result.response?.text?.() ?? "";
    const cleanedText = sanitizeJson(responseText);

    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText);
    } catch {
      console.error("JSON parse failed:", responseText);
      parsedData = fallbackFeedback(topic, side);
    }

    return NextResponse.json(parsedData);
  } catch (error: unknown) {
    console.error("Judge API Critical Error:", error);
    return NextResponse.json(fallbackFeedback(topic, side));
  }
};