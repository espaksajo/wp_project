import express from "express";
import { bookSeats, getMyBookings } from "../controllers/booking.controllers.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/bookings", protect, bookSeats);
router.get("/bookings/my", protect, getMyBookings);

export default router;
