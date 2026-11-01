import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  listUserEvents,
  deleteEvent,
} from "../controllers/event.controllers.js";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);

router.post("/events", protect, upload.single("image"), createEvent);
router.get("/users/:userId/events", protect, listUserEvents);
router.delete("/events/:id", protect, deleteEvent);

export default router;
