import express from "express";
import {
  addVillage,
  getVillageData,
  getWeatherData,
  listVillages,
} from "../controllers/data.controller.js";

const router = express.Router();

router.get("/villages", listVillages);
router.post("/add-village", addVillage);
router.get("/get-village", getVillageData);
router.get("/villages/search", getVillageData);
router.get("/weather", getWeatherData);

export default router;
