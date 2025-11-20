import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function sanitizeJson(text: string): string {
  return text.replace(/```json|```/g, "").trim();
}

function fallbackFeedback(question: string, category: string) {
  return {
    transcript: "Audio processing unavailable. Please ensure your microphone is working.",
    totalScore: 50,
    scores: [
      { criteria: "Content Clarity", score: 10, maxScore: 20 },
      { criteria: "Confidence & Tone", score: 10, maxScore: 20 },
      { criteria: "Structure (STAR)", score: 10, maxScore: 20 },
      { criteria: "Relevance to Question", score: 10, maxScore: 20 },
      { criteria: "Filler Words", score: 10, maxScore: 20 },
    ],
    feedback: "Unable to process audio at this time. Please try again with a working microphone.",
    improvements: [
      "Ensure microphone permissions are granted",
      "Speak clearly and at a moderate pace",
      "Use the STAR method for competency questions",
    ],
    strengths: [],
  };
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";

  if (!apiKey) {
    console.warn("Gemini API key missing. Returning fallback feedback.");
    const formData = await req.formData();
    const question = (formData.get("question") as string) || "Unknown question";
    const category = (formData.get("category") as string) || "Unknown";
    return NextResponse.json(fallbackFeedback(question, category));
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const question = (formData.get("question") as string) || "Unknown question";
    const category = (formData.get("category") as string) || "Unknown";

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: "No audio detected" }, { status: 400 });
    }

    // Convert File to Base64 for Gemini
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBytes = Buffer.from(arrayBuffer);
    const base64Audio = audioBytes.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
You are a senior Ethiopian Airlines captain evaluating a trainee pilot candidate's interview response. Your judgemnet should be very strict and harsh. Don't give any sugarcoating, Don't just give out scores, give out detailed feedback and improvements. Be harsh, You are trying to make him better, not make him feel good. The candidate is given 3 minutes to answer the question. Also you have to check the time management of the candidate to answer the question in the given time.

Question: "${question}"
Category: ${category}

Evaluate the candidate's response based on these criteria (0-20 points each, total out of 100):
1. Content Clarity - How clear and understandable is the response?
2. Confidence & Tone - Does the candidate speak with confidence and appropriate tone?
3. Structure (STAR) - For competency questions, is the STAR method used effectively?
4. Relevance to Question - How well does the answer address the question asked?
5. Filler Words - How many filler words (um, uh, like) are used? Less is better.

Return strictly valid JSON. No markdown code blocks.
JSON Structure:
{
  "transcript": "The candidate's speech transcribed text...",
  "totalScore": 85,
  "scores": [
    { "criteria": "Content Clarity", "score": 18, "maxScore": 20 },
    { "criteria": "Confidence & Tone", "score": 17, "maxScore": 20 },
    { "criteria": "Structure (STAR)", "score": 16, "maxScore": 20 },
    { "criteria": "Relevance to Question", "score": 18, "maxScore": 20 },
    { "criteria": "Filler Words", "score": 16, "maxScore": 20 }
  ],
  "feedback": "Professional, detailed feedback for the candidate focusing on what they did well and what needs improvement.",
  "improvements": ["Specific improvement area 1", "Specific improvement area 2", "Specific improvement area 3"],
  "strengths": ["Specific strength 1", "Specific strength 2"]
}
`;

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
    } catch (parseError) {
      console.error("JSON parse failed:", responseText);
      parsedData = fallbackFeedback(question, category);
    }

    // Ensure all required fields exist
    const safeData = {
      transcript: parsedData.transcript || "No transcript available",
      totalScore: typeof parsedData.totalScore === "number" ? parsedData.totalScore : 50,
      scores: Array.isArray(parsedData.scores) && parsedData.scores.length > 0
        ? parsedData.scores.map((s: any) => ({
            criteria: s.criteria || "Unknown",
            score: typeof s.score === "number" ? s.score : 10,
            maxScore: typeof s.maxScore === "number" ? s.maxScore : 20,
          }))
        : fallbackFeedback(question, category).scores,
      feedback: parsedData.feedback || "No feedback provided.",
      improvements: Array.isArray(parsedData.improvements) ? parsedData.improvements : [],
      strengths: Array.isArray(parsedData.strengths) ? parsedData.strengths : [],
    };

    return NextResponse.json(safeData);
  } catch (error) {
    console.error("Judge API Critical Error:", error);
    const formData = await req.formData();
    const question = (formData.get("question") as string) || "Unknown question";
    const category = (formData.get("category") as string) || "Unknown";
    return NextResponse.json(fallbackFeedback(question, category));
  }
}


