import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FALLBACK_QUESTIONS: Record<string, string[]> = {
  "HR & Motivation": [
    "Tell us about yourself and why you want to become a pilot with Ethiopian Airlines.",
    "What motivates you to pursue a career in aviation?",
    "How do you handle stress and pressure in high-stakes situations?",
    "Why did you choose Ethiopian Airlines over other carriers?",
    "Describe a time when you had to make a difficult decision under time pressure.",
  ],
  "Competency (STAR)": [
    "Describe a time you managed cockpit workload when a checklist suddenly changed.",
    "Tell us about a situation where you had to work effectively in a team under pressure.",
    "Give an example of when you demonstrated leadership in a challenging situation.",
    "Describe a time you had to adapt quickly to unexpected changes during training.",
    "Share an experience where you resolved a conflict with a colleague or instructor.",
  ],
  "Airline Knowledge": [
    "What do you know about Ethiopian Airlines' history and growth?",
    "Can you explain Ethiopian Airlines' hub strategy and route network?",
    "What are Ethiopian Airlines' core values and how do they align with your own?",
    "What do you know about Ethiopian Airlines' fleet composition?",
    "How does Ethiopian Airlines contribute to Africa's aviation industry?",
  ],
  "Technical Rapid Fire": [
    "Explain the four forces of flight.",
    "What is the difference between VOR and ILS navigation?",
    "Describe the basic principles of aerodynamics.",
    "What is CRM and why is it important in the cockpit?",
    "Explain the importance of checklists in aviation operations.",
  ],
};

function getRandomFallback(category: string): string {
  const questions = FALLBACK_QUESTIONS[category] || FALLBACK_QUESTIONS["HR & Motivation"];
  return questions[Math.floor(Math.random() * questions.length)];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "HR & Motivation";

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";

  if (!apiKey) {
    console.warn("Gemini API key missing. Returning static question.");
    return NextResponse.json({
      question: getRandomFallback(category),
      category: category,
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Generate exactly ONE professional interview question for Ethiopian Airlines trainee pilot candidates.
Category: ${category}

The question should be:
- Relevant to the category provided
- Appropriate for a pilot interview setting
- Clear and specific
- Professional and realistic

Return strictly valid JSON: { "question": "string", "category": "string" }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response?.text?.() ?? "";
    const cleanedText = responseText.replace(/```json|```/g, "").trim();

    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText);
    } catch {
      parsedData = { question: getRandomFallback(category), category: category };
    }

    return NextResponse.json({
      question: parsedData.question || getRandomFallback(category),
      category: parsedData.category || category,
    });
  } catch (error) {
    console.error("Generate Question API Error:", error);
    return NextResponse.json({
      question: getRandomFallback(category),
      category: category,
    });
  }
}


