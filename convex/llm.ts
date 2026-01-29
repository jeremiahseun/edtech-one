import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateExplanation = action({
  args: {
    query: v.string(),
    contextDocs: v.array(v.string())
  },
  handler: async (ctx, args) => {
    // Construct prompt
    const context = args.contextDocs.join("\n\n");
    const prompt = `Context:\n${context}\n\nQuestion: ${args.query}`;

    // CHOICE: Use DeepSeek for complex reasoning
    if (isComplexQuery(args.query)) {
      if (!process.env.DEEPSEEK_API_KEY) throw new Error("DeepSeek Key missing");

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat", // V3
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    }

    // DEFAULT: Use Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
});

function isComplexQuery(query: string): boolean {
  // Simple heuristic for MVP
  const complexKeywords = ["prove", "derive", "calculate", "solve", "why"];
  return complexKeywords.some(k => query.toLowerCase().includes(k));
}
