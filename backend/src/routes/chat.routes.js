import { Router } from "express";
import {
  deleteChat,
  getChats,
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controller/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

chatRouter.post("/message", authMiddleware, sendMessage);
chatRouter.get("/", authMiddleware, getChats)
chatRouter.get("/messages/:chatId", authMiddleware, getMessages)
chatRouter.delete("/delete/chat/:chatId", authMiddleware, deleteChat)
chatRouter.delete("/delete/message/:messageId", authMiddleware, deleteMessage)

export default chatRouter;
