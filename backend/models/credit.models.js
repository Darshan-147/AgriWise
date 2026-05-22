import mongoose from "mongoose";

const riskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", index: true },
    State: { type: String, required: true, trim: true, index: true },
    City: { type: String, required: true, trim: true },
    Crop: { type: String, required: true, trim: true },
    pH_soil: { type: Number, required: true, default: 7.0 },
    Area_ha: { type: Number, required: true, default: 1.0 },
    avgTemp: { type: Number, required: true, default: 25.0 },
    Rainfall_mm: { type: Number, required: true, default: 100 },
    Yield_ton_ha: { type: Number, required: true, default: 2.5 },
    Avg_smlvl: { type: Number, required: true, default: 1.0 },
    Soil_Type: { type: String, required: true, default: "Loamy", trim: true },
    Nutrient_Level: { type: String, required: true, default: "Medium", trim: true },
    Credit_Score: { type: Number, required: true, default: 600 },
    Predicted_Risk_Score: { type: Number, required: false },
  },
  { timestamps: true }
);

const RiskModel = mongoose.model("Risk", riskSchema);

const riskScoreSchema = new mongoose.Schema(
  {
    riskId: { type: mongoose.Schema.Types.ObjectId, ref: "Risk", required: true, index: true },
    Predicted_Risk_Score: { type: Number, required: true },
  },
  { timestamps: true }
);

const RiskScoreModel = mongoose.model("RiskScore", riskScoreSchema);

export { RiskModel, RiskScoreModel };
