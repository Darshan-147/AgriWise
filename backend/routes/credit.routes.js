import express from "express";
import { storeRiskData, getRiskScores } from "../controllers/credit.controller.js";
import protect from "../Middleware/protect.middleware.js";

const router = express.Router();

// Route to store risk data and predict risk score
router.post("/store", protect, storeRiskData);

// Route to get all stored risk scores
router.get("/scores", getRiskScores);

export default router;
