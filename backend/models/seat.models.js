import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  seatNumber: { type: String, required: true },
  status: { type: String, enum: ["available", "reserved", "booked"], default: "available" },
  price: { type: Number, required: true },
});

seatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;
