import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import reserveRoutes from "./routes/reserve.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api", eventRoutes);
app.use("/api", reserveRoutes);
app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Sort My Scene API is running" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

export default app;
