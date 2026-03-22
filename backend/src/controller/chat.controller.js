import { generateChatTitle, generateResponse } from "../service/ai.service.js";
import { AsyncHandler } from "../service/AsyncHandler.service.js";
import chats from "../models/chat.model.js";
import messages from "../models/message.model.js";
import { ApiError } from "../service/ApiError.service.js";
import { ApiResponse } from "../service/ApiResponse.service.js";

export const sendMessage = AsyncHandler(async (req, res) => {
  const { message, chat: chatId } = req.body;

  if (!message) {
    throw new ApiError(400, "Message is required");
  }

  let chat = null;
  let title = null;

  if (!chatId) {
    try {
      title = await generateChatTitle(message);
    } catch (error) {
      title = "New Chat";
    }

    chat = await chats.create({
      user: req.user.id,
      title,
    });
  } else {
    chat = await chats.findById(chatId || chat._id);

    if (!chat) {
      throw new ApiError(400, "Chat not found");
    }
  }

  const currentChatId = chatId || chat._id;

  await messages.create({
    chat: currentChatId,
    content: message,
    role: "user",
  });

  let allMessage = await messages.find({ chat: currentChatId });

  let result = "";

  try {
    result = await generateResponse(allMessage);
  } catch (error) {
    console.log("Ai error: ", error.message);
    result = "Ai is currently unavailable, Please try again later";
    throw new ApiError(500, "Failed to get response from AI");
  }

  const AIMessage = await messages.create({
    chat: currentChatId,
    content: result,
    role: "ai",
  });

  return res.status(200).json(
    new ApiResponse(200, {
      title,
      chat,
      AIMessage,
    }),
  );
});

export const getChats = AsyncHandler(async (req, res) => {
  const user = req.user;

  const chat = await chats.find({
    user: user.id,
  });

  if (!chat) {
    throw new ApiError(400, "Chat not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, chat, "Chats fetched successfully"));
});

export const getMessages = AsyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await chats.findOne({ _id: chatId, user: req.user.id });

  if (!chat) {
    throw new ApiError(404, "Chat not found or not accessible");
  }

  const message = await messages.find({ chat: chatId });

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Messages fetched successfully"));
});

export const deleteChat = AsyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await chats.findOneAndDelete({ _id: chatId });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  await messages.deleteMany({ chat: chatId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Chat deleted successfully"));
});
