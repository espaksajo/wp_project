import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  seatIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seat" }],
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expires: "0s" } },
});

reservationSchema.index({ userId: 1, eventId: 1 });

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
