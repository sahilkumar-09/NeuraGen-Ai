import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0.7
});

const mistralModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
  temperature: 0.7
});

const geminiModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash-lite",
  temperature: 0.7
});

export const generateResponse = async (message) => {
  try {
    const response = await groqModel.invoke([new HumanMessage(message)]);
    return response.content
  } catch (error) {
    console.log("Griq generating response: ", error)
    try {
      const fallback1 = await mistralModel.invoke([new HumanMessage(message)])
      return fallback1.content
    } catch (error) {
      console.log("Mistral generating response: ", error)
      try {
        const fallback2 = await geminiModel.invoke([new HumanMessage(message)])
        return fallback2.content
      } catch (error) {
        console.log("Google generative ai generating response: ", error)
      }
    }
  }
}

export const generateChatTitle = async (message) => {
  try {
    const response = await groqModel.invoke([
      new SystemMessage(`You are a helpful assistant that generates concise chat titles based on the user's first message. The title should be 5 words or less and capture the essence of the conversation.  

        User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 3-5 words. The title should be clear, relevant and engaging giving users a quick understanding of the chat's topic.`),
      new HumanMessage(`Generate a title: ${message})}`)
    ])

    return response.content
  } catch (error)
  {
    console.log("Error generating chat title: ", error)
  }
}