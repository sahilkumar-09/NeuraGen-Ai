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
    "Search the internet in real-time to find accurate, up-to-date information, news, and answers for user queries.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet. "),
  }),
});

const agent = createAgent({
  model: groqModel,
  tools: [searchInternetTool],
  systemMessage: `
You are a helpful and  precise assistant for answering questions.
If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
`,
})

const formatMessages = (allMessages) => {
  if (!allMessages || allMessages.length === 0) {
    return [new HumanMessage("Hello")];
  }

  return allMessages
    .map((msg) => {
      if (!msg || !msg.content) return null;

      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      }

      if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }

      if (msg.role === "system") {
        return new SystemMessage(msg.content);
      }

      return null;
    })
    .filter(Boolean);
};

export const generateResponse = async (allMessages) => {
  const formattedMessages = formatMessages(allMessages);

  try {
    const response = await agent.invoke(
      { messages: formattedMessages },
      { recursionLimit: 5 },
    );

    return response?.messages?.at(-1)?.content;
  } catch (error) {
    console.log("Agent Error:", error);

    try {
      const fallback1 = await mistralModel.invoke(formattedMessages);
      return fallback1.content;
    } catch (error) {
      try {
        const fallback2 = await geminiModel.invoke(formattedMessages);
        return fallback2.content;
      } catch (error) {
        return "All models failed";
      }
    }
  }
};

export const generateChatTitle = async (message) => {
  try {
    const response = await groqModel.invoke([
      new SystemMessage(`You are a helpful assistant that generates concise chat titles based on the user's first message. The title should be 5 words or less and capture the essence of the conversation.  

        User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 3-5 words. The title should be clear, relevant and engaging giving users a quick understanding of the chat's topic.`),
      new HumanMessage(`Generate a title: ${message})}`),
    ]);

    return response.content;
  } catch (error) {
    console.log("Error generating chat title: ", error);
  }
};
