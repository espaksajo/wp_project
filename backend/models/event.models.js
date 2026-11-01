import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    totalSeats: { type: Number, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    imageUrl: { type: String, default: "" },
    ticketPrice: { type: Number, default: 500 },
  },
  { timestamps: true }
);

eventSchema.index({ ownerId: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
