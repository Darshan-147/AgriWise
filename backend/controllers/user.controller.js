import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import User from "../models/user.model.js";

const userProjection = "username email role profilePic createdAt updatedAt";

export const getAllUsers = asyncHandler(async (req, res) => {
  const filters = {};

  if (typeof req.query.role === "string" && req.query.role.trim()) {
    filters.role = req.query.role.trim().toLowerCase();
  }

  const users = await User.find(filters)
    .select(userProjection)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(userProjection).lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(user);
});
