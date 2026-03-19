import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import http from "http"
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 4000;

const httpServer = http.createServer(app)

initSocket(httpServer);

connectDB()


httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
