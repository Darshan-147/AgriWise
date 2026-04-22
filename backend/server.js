import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import dataRoutes from "./routes/data.routes.js";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./Db/connectDb.js";
import authRoutes2 from "./routes/auth2.route.js";
import creditRoutes from "./routes/credit.routes.js";
import userRoutes from "./routes/user.routes.js";
import config from "./Config/app.config.js";
import { globalErrorHandler, notFoundHandler } from "./Middleware/error.middleware.js";

dotenv.config();

const app = express();

const allowedOrigins = new Set(config.corsOrigins);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin is not allowed."));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

if (config.nodeEnv !== "test") {
  app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
}

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Bluelock backend is running.",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", dataRoutes);
app.use("/auth", authRoutes);
app.use("/auth2", authRoutes2);
app.use("/credit", creditRoutes);
app.use("/users", userRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
