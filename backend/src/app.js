import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import morgan from "morgan";

const app = express();

// Middleware Configuration
app.use(morgan("dev"))
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
  }),
);

app.use("/api/v1/auth", authRoutes)

export default app;
