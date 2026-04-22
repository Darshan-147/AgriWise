import crypto from "crypto";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import bcrypt from "bcryptjs";
import uploadOnCloudinary from "../Utils/FileUpload.js";
import User from "../models/user.model.js";
import asyncHandler from "../Utils/asyncHandler.js";
import sendEmail from "../Utils/email.js";
import ApiError from "../Utils/ApiError.js";
import config from "../Config/app.config.js";

const allowedRoles = new Set(["admin", "user"]);

const unwrapValue = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  if (value && typeof value === "object") {
    for (const nestedValue of Object.values(value)) {
      const extractedValue = unwrapValue(nestedValue);

      if (extractedValue) {
        return extractedValue;
      }
    }
  }

  return "";
};

const normalizeEmail = (value) => unwrapValue(value).toLowerCase();
const normalizeRole = (value) => unwrapValue(value).toLowerCase();

const signToken = (id) =>
  jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

const serializeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  profilePic: user.profilePic,
  notVerified: Boolean(user.notVerified),
});

const buildEmailTemplate = ({ heading, description, code, note }) => `
  <div style="font-family:Arial,sans-serif;background:#f6f7fb;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
      <h1 style="margin:0 0 12px;color:#0f172a;">${heading}</h1>
      <p style="margin:0 0 20px;color:#475569;line-height:1.6;">${description}</p>
      ${
        code
          ? `<div style="font-size:28px;font-weight:700;letter-spacing:6px;color:#2563eb;background:#eff6ff;border-radius:12px;padding:16px 20px;text-align:center;">${code}</div>`
          : ""
      }
      <p style="margin:20px 0 0;color:#64748b;line-height:1.6;">${note}</p>
    </div>
  </div>
`;

const sendAuthToken = (res, user, statusCode, message) => {
  const token = signToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
  });

  return res.status(statusCode).json({
    status: "success",
    message,
    token,
    role: user.role,
    data: {
      user: serializeUser(user),
    },
  });
};

const getUserForAuth = async (email) =>
  User.findOne({ email }).select("+password +notVerified");

export const signup = asyncHandler(async (req, res) => {
  const username = unwrapValue(req.body.username);
  const email = normalizeEmail(req.body.email);
  const password = unwrapValue(req.body.password);
  const confirmPassword = unwrapValue(req.body.confirmPassword);
  const role = normalizeRole(req.body.role) || "user";

  if (!username || !email || !password || !confirmPassword) {
    throw new ApiError(400, "Username, email, password, and confirmPassword are required.");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match.");
  }

  if (!allowedRoles.has(role)) {
    throw new ApiError(400, "Invalid role selected.");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const newUser = await User.create({
    username,
    email,
    password,
    confirmPassword,
    role,
  });

  return sendAuthToken(
    res,
    newUser,
    201,
    "Account created successfully. Please verify your email."
  );
});

export const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = unwrapValue(req.body.password);

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password.");
  }

  const user = await getUserForAuth(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Email or password is not valid.");
  }

  if (user.notVerified) {
    return res.status(200).json({
      status: "success",
      message: "User is not verified.",
      notVerified: true,
    });
  }

  return sendAuthToken(res, user, 200, "Login successful.");
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
});

export const protect = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  let token = null;

  if (authorizationHeader?.startsWith("Bearer ")) {
    token = authorizationHeader.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Invalid authorization token. Please provide a valid token.");
  }

  let decodedToken;

  try {
    decodedToken = await promisify(jwt.verify)(token, config.jwtSecret);
  } catch (error) {
    throw new ApiError(401, "Token has expired or is invalid.");
  }

  const user = await User.findById(decodedToken.id).select("+notVerified");

  if (!user) {
    throw new ApiError(401, "The user with the provided token no longer exists.");
  }

  if (user.isPasswordChanged(decodedToken.iat)) {
    throw new ApiError(401, "Your password changed recently. Please log in again.");
  }

  req.user = user;
  next();
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!email) {
    throw new ApiError(400, "Email is required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "We could not find a user with that email.");
  }

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;
  const message = buildEmailTemplate({
    heading: "Reset your password",
    description:
      "We received a request to reset your password. Use the link below to choose a new one.",
    note: `Reset link: ${resetUrl}<br /><br />This link is valid for 10 minutes.`,
  });

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset request",
      message,
    });
  } catch (error) {
    user.PasswordResetToken = undefined;
    user.PasswordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "There was an error sending the reset email. Please try again later.");
  }

  res.status(200).json({
    status: true,
    message: "Password reset link sent to the registered email address.",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const token = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const password = unwrapValue(req.body.password);
  const confirmPassword = unwrapValue(req.body.confirmPassword);

  if (!password || !confirmPassword) {
    throw new ApiError(400, "Password and confirmPassword are required.");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match.");
  }

  const user = await User.findOne({
    PasswordResetToken: token,
    PasswordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Token has expired or is invalid.");
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.PasswordResetToken = undefined;
  user.PasswordResetTokenExpires = undefined;
  user.PasswordChangedAt = Date.now();

  await user.save();

  return sendAuthToken(res, user, 200, "Password reset successfully.");
});

export const getVarified = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.emailId);

  if (!email) {
    throw new ApiError(400, "Email is required to request OTP.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const otp = await user.generateOtp();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Verify your email",
      message: buildEmailTemplate({
        heading: "Email verification",
        description: "Use the OTP below to verify your Bluelock account.",
        code: otp,
        note: "This OTP is valid for a limited time.",
      }),
    });
  } catch (error) {
    user.otp = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "There was an error sending the OTP email. Please try again later.");
  }

  res.status(200).json({
    status: true,
    message: "OTP sent to the registered email address.",
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const userOtp = unwrapValue(req.body.userOtp);

  if (!userOtp) {
    throw new ApiError(400, "OTP is required.");
  }

  const hashedOtp = crypto.createHash("sha256").update(userOtp).digest("hex");
  const user = await User.findOne({ otp: hashedOtp }).select("+notVerified");

  if (!user) {
    throw new ApiError(404, "Invalid or expired OTP.");
  }

  user.notVerified = false;
  user.otp = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "OTP verification successful.",
  });
});

export const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("+notVerified");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  res.status(200).json({
    status: true,
    data: serializeUser(user),
    notVerified: user.notVerified,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const username = unwrapValue(req.body.username);
  const mainImageFile = req.file;

  if (!username && !mainImageFile) {
    throw new ApiError(400, "Provide at least one field to update.");
  }

  const user = await User.findById(req.user.id).select("+notVerified");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (username) {
    user.username = username;
  }

  if (mainImageFile) {
    const imageUploadResult = await uploadOnCloudinary(mainImageFile.path);

    if (!imageUploadResult?.url) {
      throw new ApiError(500, "Failed to upload profile image.");
    }

    user.profilePic = imageUploadResult.url;
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "User profile updated successfully.",
    user: serializeUser(user),
  });
});

export const changeEmailVerificationOtpReq = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.emailId || req.user.email);
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const otp = await user.generateOtpForChangingEmail();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Verify your email change",
      message: buildEmailTemplate({
        heading: "Email change verification",
        description: "Use the OTP below to approve the email change request on your account.",
        code: otp,
        note: "If you did not request this change, you can ignore this email.",
      }),
    });
  } catch (error) {
    user.changeEmailVerificationOtp = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "There was an error sending the OTP email. Please try again later.");
  }

  res.status(200).json({
    status: true,
    message: "Email change OTP sent successfully.",
  });
});

export const changeEmailVerifyOtp = asyncHandler(async (req, res) => {
  const userOtp = unwrapValue(req.body.userOtp);

  if (!userOtp) {
    throw new ApiError(400, "OTP is required.");
  }

  const hashedOtp = crypto.createHash("sha256").update(userOtp).digest("hex");
  const user = await User.findOne({ changeEmailVerificationOtp: hashedOtp });

  if (!user) {
    throw new ApiError(404, "Invalid or expired OTP.");
  }

  user.changeEmailVerificationOtp = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    changeEmailSuccess: true,
    message: "Email change OTP verification successful.",
  });
});

export const changeRole = asyncHandler(async (req, res) => {
  const role = normalizeRole(req.body.role);

  if (!allowedRoles.has(role)) {
    throw new ApiError(400, "A valid role is required.");
  }

  const user = await User.findById(req.user.id).select("+notVerified");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.role = role;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Role changed successfully.",
    data: serializeUser(user),
  });
});
