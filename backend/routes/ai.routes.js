import express from "express";
import { chatWithAgriAdvisor } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", chatWithAgriAdvisor);

export default router;
