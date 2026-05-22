import mongoose from "mongoose";
import config from "../Config/app.config.js";

const connectDB = async () => {
  if (!config.mongoUri) {
    throw new Error("MONGO_URI is not configured.");
  }

  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: config.mongoServerSelectionTimeoutMs,
  });
  console.log("MongoDB connected.");
};

export default connectDB;
