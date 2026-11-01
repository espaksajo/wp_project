import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    seatNumbers: [{ type: String }],
    totalAmount: { type: Number, required: true },
    bookingId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
