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

  const riskData = await RiskModel.create(normalizedPayload);

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
    predictionStatus = "prediction_unavailable";
  }

  res.status(predictionStatus === "predicted" ? 201 : 202).json({
    message:
      predictionStatus === "predicted"
        ? "Risk data stored and prediction saved."
        : "Risk data stored, but prediction service is currently unavailable.",
    predictedRiskScore,
    predictionStatus,
    riskId: riskData._id,
  });
});

export const getRiskScores = asyncHandler(async (req, res) => {
  const riskScores = await RiskScoreModel.find()
    .populate({
      path: "riskId",
      select: "State City Crop Credit_Score Predicted_Risk_Score createdAt",
    })
    .sort({ createdAt: -1 })
    .lean();

  const serializedScores = riskScores.map((riskScore) => ({
    _id: riskScore._id,
    riskId: riskScore.riskId?._id || null,
    Predicted_Risk_Score: riskScore.Predicted_Risk_Score,
    risk: riskScore.riskId || null,
    createdAt: riskScore.createdAt,
    updatedAt: riskScore.updatedAt,
  }));

  res.status(200).json(serializedScores);
});
