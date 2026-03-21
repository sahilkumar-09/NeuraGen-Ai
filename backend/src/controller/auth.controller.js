import { AsyncHandler } from "../service/AsyncHandler.service.js";
import { ApiError } from "../service/ApiError.service.js";
import users from "../models/user.model.js";
import { sendEmail } from "../service/mail.service.js";
import { ApiResponse } from "../service/ApiResponse.service.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import redisClient from "../service/Redis.service.js";

const userRegisterController = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "all fields are required");
  }

  const isUserExists = await users.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await users.create({
    username,
    email,
    password,
  });

  const emailVerification = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  delete user._doc.password;

  await sendEmail({
    to: email,
    subject: "Welcome to NeuraGen Ai 🎉",
    text: `Hi ${username},

Thank you for signing up for Perplexity!\n\n

We’re excited to have you on board. You can now start exploring and making the most out of our platform.\n\n

If you have any questions, feel free to reach out to us anytime.

Best regards,
The Perplexity Team
`,
    html: `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 2px 10px rgba(0,0,0,0.1)">
      
      <h2 style="color:#333;">Welcome to NeuraGen, ${username}! 🎉</h2>
      
      <p style="font-size:16px; color:#555;">
        Thank you for signing up. We're excited to have you join our platform!
      </p>

      <p style="font-size:16px; color:#555;">
        You can now start exploring all the features and make the most out of Perplexity.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="http://localhost:3000/api/v1/auth/user/verify-email?token=${emailVerification}"
          style="background:#4f46e5; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:6px; font-size:16px;">
          Get Started
        </a>
      </div>

      <p style="font-size:14px; color:#888;">
        If you have any questions, feel free to contact our support team anytime.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

      <p style="font-size:13px; color:#999;">
        © 2026 Perplexity. All rights reserved.
      </p>

    </div>
  </div>
  `,
  });

  res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

const verifyEmail = AsyncHandler(async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await users.findOne({ email: decoded.email });

    if (!user) {
      throw new ApiError(400, "Invalid Token");
    }

    user.verified = true;
    await user.save();

    res.send(
      `
       <html>
      <body style="font-family:Arial;background:#f4f6f8;padding:40px;">
        <div style="max-width:500px;margin:auto;background:white;padding:30px;border-radius:10px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
          
          <h2 style="color:#22c55e;">✅ Email Verified Successfully</h2>
          
          <p style="color:#555;font-size:16px;">
            Your email has been verified successfully.  
            You can now login to your account.
          </p>

          <a href="http://localhost:5173/auth/user/email-checked"
            style="display:inline-block;margin-top:20px;padding:12px 25px;background:#4f46e5;color:white;text-decoration:none;border-radius:6px;font-size:16px;">
            Verified
          </a>

          <p style="margin-top:20px;font-size:13px;color:#999;">
            © 2026 Perplexity
          </p>

        </div>
      </body>
    </html>
    `,
    );
  } catch (error) {
    throw new ApiError(400, "Invalid or expired token");
  }
});

const userLoginController = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await users.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.verified) {
    throw new ApiError(400, "Please verify your email before logging in");
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE },
  );

  res.cookie("token", token);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          verified: user.verified,
        },
      },
      "User logged in successfully",
    ),
  );
});

const getMeController = AsyncHandler(async (req, res) => {
  const userid = req.user.id;

  const user = await users.findById(userid).select("-password");

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

const forgetPasswordController = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await users.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const resetURL = `http://localhost:5173/auth/user/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    text: `Reset your password: ${resetURL}`,
    html: `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 2px 10px rgba(0, 0, 0, 0.1)">
        <h2 style="color:#333;">Password Reset Request</h2>
        <p style="font-size:16px; color:#555;">Hello ${user.username},</p>
        <p style="font-size:16px; color:#555;">You have requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align:center; margin:30px 0;">
          <a href="${resetURL}" style="background:#4f46e5; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:6px; font-size:16px;">Reset Password</a>
        </div>
        <p style="font-size:14px; color:#888;">If you did not request this, please ignore this email.</p>
        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
        <p style="font-size:13px; color:#999;">© 2026 Perplexity. All rights reserved.</p>
      </div>
    </div>
    `,
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset link sent to your email"));
});

const resetPasswordController = AsyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await users.findOne({
    resetPasswordToken: hashToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or Expired Token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

const logoutController = AsyncHandler(async (req, res) => {
  const token = req.cookies.token || req.headers.Authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(400, "No token provided");
  }

  await redisClient.set(token, "logout", "Ex", 60 * 60 * 24);

  res.clearCookie("token");

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

export {
  userRegisterController,
  verifyEmail,
  userLoginController,
  getMeController,
  forgetPasswordController,
  resetPasswordController,
  logoutController,
}