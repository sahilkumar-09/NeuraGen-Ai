import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage, SystemMessage, createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0.7,
});

const mistralModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
  temperature: 0.7,
});

const geminiModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash-lite",
  temperature: 0.7,
});

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description:
    "Search the internet in real-time to find accurate, up-to-date information, news, and answers.",
  schema: z.object({
    query: z.string().describe("Search query"),
  }),
});

const agent = createAgent({
  model: groqModel,
  tools: [searchInternetTool],
});

const buildMessages = (allMessages = []) => {
  return [
    new SystemMessage(`
You are a helpful AI assistant.
And your name is NeuraGen AI
Guidelines:
- Be clear, concise, and friendly.
- Prioritize accuracy.
- If unsure, say you don't know.
- Use conversation history for context.
- If the user asks about real-time info, news, or current events, use the searchInternet tool.
`),
    ...allMessages
      .map((msg) => {
        if (!msg || !msg.content) return null;
        if (msg.role === "user") return new HumanMessage(msg.content);
        if (msg.role === "ai") return new AIMessage(msg.content);
        return null;
      })
      .filter(Boolean),
  ];
};

export const generateResponse = async (allMessages) => {
  const messages = buildMessages(allMessages);

  try {
    const response = await agent.invoke({ messages });
    return response?.messages?.at(-1)?.content || "No response generated";
  } catch (err1) {
    console.log("Groq Agent Error:", err1);
    try {
      const fallback1 = await mistralModel.invoke(messages);
      return fallback1.content;
    } catch (err2) {
      console.log("Mistral Error:", err2);
      try {
        const fallback2 = await geminiModel.invoke(messages);
        return fallback2.content;
      } catch (err3) {
        console.log("Gemini Error:", err3);
        return "All models failed. Please try again later.";
      }
    }
  }
};

export const generateChatTitle = async (message) => {
  try {
    const response = await groqModel.invoke([
      new SystemMessage(`
You generate short chat titles.

Rules:
- 3 to 5 words only
- Clear and engaging
- Capture the main topic
      `),
      new HumanMessage(`Generate a title: ${message}`),
    ]);

    return response.content.trim();
  } catch (error) {
    console.log("Error generating chat title:", error);
    return "New Chat";
  }
};
