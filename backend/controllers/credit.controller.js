import axios from "axios";
import { RiskModel, RiskScoreModel } from "../models/credit.models.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import config from "../Config/app.config.js";

const numericFieldDefaults = {
  pH_soil: 7.0,
  Area_ha: 1.0,
  avgTemp: 25.0,
  Rainfall_mm: 100,
  Yield_ton_ha: 2.5,
  Avg_smlvl: 1.0,
  Credit_Score: 600,
};

const normalizeText = (value) => String(value ?? "").trim();

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const calculateFallbackRiskScore = (payload) => {
  const creditRisk = (900 - clamp(payload.Credit_Score, 100, 900)) / 800;
  const phRisk = clamp(Math.abs(payload.pH_soil - 6.8) / 2.5, 0, 1);
  const rainfallRisk = payload.Rainfall_mm < 450 || payload.Rainfall_mm > 1800 ? 0.7 : 0.25;
  const yieldRisk = clamp((5 - payload.Yield_ton_ha) / 5, 0, 1);
  const moistureRisk = clamp(Math.abs(payload.Avg_smlvl - 35) / 35, 0, 1);

  return Number(
    (
      (creditRisk * 0.35 + phRisk * 0.15 + rainfallRisk * 0.2 + yieldRisk * 0.2 + moistureRisk * 0.1) *
      100
    ).toFixed(2)
  );
};

const normalizeRiskPayload = (payload) => {
  const normalizedPayload = {
    State: normalizeText(payload.State),
    City: normalizeText(payload.City),
    Crop: normalizeText(payload.Crop),
    Soil_Type: normalizeText(payload.Soil_Type || "Loamy"),
    Nutrient_Level: normalizeText(payload.Nutrient_Level || "Medium"),
  };

  for (const [field, defaultValue] of Object.entries(numericFieldDefaults)) {
    const rawValue = payload[field] ?? defaultValue;
    const parsedValue = Number(rawValue);

    if (!Number.isFinite(parsedValue)) {
      throw new ApiError(400, `${field} must be a valid number.`);
    }

    normalizedPayload[field] = parsedValue;
  }

  return normalizedPayload;
};

export const storeRiskData = asyncHandler(async (req, res) => {
  const normalizedPayload = normalizeRiskPayload(req.body);

  if (!normalizedPayload.State || !normalizedPayload.City || !normalizedPayload.Crop) {
    throw new ApiError(400, "State, City, and Crop are required.");
  }

  const riskData = await RiskModel.create({
    ...normalizedPayload,
    userId: req.user?._id,
  });

  let predictedRiskScore = null;
  let predictionStatus = "saved";

  try {
    const flaskResponse = await axios.post(config.mlServiceUrl, normalizedPayload, {
      timeout: 10000,
    });

    predictedRiskScore = Number(
      flaskResponse.data?.["Predicted Risk Score (%)"] ??
        flaskResponse.data?.Predicted_Risk_Score ??
        flaskResponse.data?.predictedRiskScore
    );

    if (Number.isFinite(predictedRiskScore)) {
      await RiskScoreModel.create({
        riskId: riskData._id,
        Predicted_Risk_Score: predictedRiskScore,
      });

      riskData.Predicted_Risk_Score = predictedRiskScore;
      await riskData.save();
      predictionStatus = "predicted";
    }
  } catch (error) {
    predictedRiskScore = calculateFallbackRiskScore(normalizedPayload);
    await RiskScoreModel.create({
      riskId: riskData._id,
      Predicted_Risk_Score: predictedRiskScore,
    });

    riskData.Predicted_Risk_Score = predictedRiskScore;
    await riskData.save();
    predictionStatus = "fallback_predicted";
  }

  res.status(201).json({
    message:
      predictionStatus === "predicted"
        ? "Risk data stored and prediction saved."
        : "Risk data stored and a fallback risk score was calculated.",
    predictedRiskScore,
    predictionStatus,
    riskId: riskData._id,
  });
});

export const getRiskScores = asyncHandler(async (req, res) => {
  const riskScores = await RiskScoreModel.find()
    .populate({
      path: "riskId",
      select: "userId State City Crop Credit_Score Predicted_Risk_Score createdAt",
      populate: {
        path: "userId",
        select: "username email role profilePic",
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  const serializedScores = riskScores.map((riskScore) => ({
    _id: riskScore._id,
    riskId: riskScore.riskId?._id || null,
    Predicted_Risk_Score: riskScore.Predicted_Risk_Score,
    risk: riskScore.riskId || null,
    user: riskScore.riskId?.userId || null,
    createdAt: riskScore.createdAt,
    updatedAt: riskScore.updatedAt,
  }));

  res.status(200).json(serializedScores);
});
