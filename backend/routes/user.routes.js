import express from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller.js";

const router = express.Router();

router.get(["/all", "/getall"], getAllUsers);
router.get("/:id", getUserById);

export default router;
