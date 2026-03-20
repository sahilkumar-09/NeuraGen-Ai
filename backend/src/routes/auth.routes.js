import express from 'express'
import {
  userRegisterController,
  verifyEmail,
  userLoginController,
  getMeController,
  forgetPasswordController,
  resetPasswordController,
  logoutController,
} from "../controller/auth.controller.js";
import { forgetPasswordValidator, loginValidator, registerValidator, resetPasswordValidator } from '../validator/auth.validator.js'
import { authMiddleware } from '../middlewares/auth.middleware.js';
const authRoutes = express.Router()

authRoutes.post("/user/register", registerValidator,userRegisterController)
authRoutes.post("/user/login", loginValidator, userLoginController)
authRoutes.post("/user/forget-password", forgetPasswordValidator, forgetPasswordController)
authRoutes.post("/user/reset-password/:token", resetPasswordValidator ,resetPasswordController)
authRoutes.get("/user/verify-email", verifyEmail);
authRoutes.get("/user/get-me", authMiddleware, getMeController)
authRoutes.get("/user/logout", authMiddleware, logoutController)


export default authRoutes