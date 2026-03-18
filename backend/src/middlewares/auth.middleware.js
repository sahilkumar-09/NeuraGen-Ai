import { ApiError } from "../service/ApiError.service.js";
import { AsyncHandler } from "../service/AsyncHandler.service.js";
import jwt from "jsonwebtoken";

const authMiddleware = AsyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token =
    req.cookies.token ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;
  next();
});

export { authMiddleware };
