import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";

const app = express();

// Middleware Configuration
app.use(morgan("dev"))
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }),
);

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/chats", chatRouter)

export default app;
