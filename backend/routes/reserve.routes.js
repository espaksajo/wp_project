import express from "express";
import { reserveSeats } from "../controllers/reserve.controllers.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/reserve", protect, reserveSeats);

export default router;
