import dotenv from "dotenv";

dotenv.config();

const parseList = (value, fallback = []) => {
  if (!value) {
    return fallback;
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.SUPER_SECRET_STRING,
  jwtExpiresIn: process.env.LOGIN_EXPIRES || "24h",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  emailUser: process.env.EMAIL,
  emailPassword: process.env.PASSWORD,
  weatherApiKey: process.env.WEATHER_API_KEY,
  bhuvanApiKey: process.env.BHUVAN_API_KEY,
  mlServiceUrl: process.env.ML_SERVICE_URL || "http://127.0.0.1:8080/predict",
  weatherCacheMinutes: Number(process.env.WEATHER_CACHE_MINUTES) || 30,
  corsOrigins: parseList(
    process.env.CORS_ORIGINS,
    process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ["http://localhost:5173"]
  ),
};

export default config;
