import { generateChatTitle, generateResponse } from "../service/ai.service.js";
import { AsyncHandler } from "../service/AsyncHandler.service.js";
import chats from "../models/chat.model.js";
import messages from "../models/message.model.js";

export const sendMessage = AsyncHandler(async (req, res) => {
  const { message, chat: chatId } = req.body;

  let chat = null;
  let title = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chats.create({
      user: req.user.id,
      title,
    });
  } else {
    chat = await chats.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    title = chat.title;
  }

  const allMessages = await messages.find({ chat: chat._id });

  const userMessage = await messages.create({
    chat: chat._id,
    content: message,
    role: "user",
  });

  const response = await generateResponse(message);

  const aiMessage = await messages.create({
    chat: chat._id,
    content: response,
    role: "ai",
  });

  res.status(201).json({
    response,
    title,
    chatId: chat._id,
    allMessages: [...allMessages, userMessage, aiMessage],
  });
});