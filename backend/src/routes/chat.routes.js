import { Router } from "express";
import { sendMessage } from "../controller/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

chatRouter.post("/message", authMiddleware, sendMessage);

export default chatRouter;
