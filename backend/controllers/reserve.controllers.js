import mongoose from "mongoose";
import Seat from "../models/seat.models.js";
import Reservation from "../models/reservation.models.js";

const RESERVATION_TTL_MINUTES = 5;

export const reserveSeats = async (req, res) => {
  const { eventId, seatNumbers } = req.body;
  const userId = req.user._id;

  if (!eventId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    return res.status(400).json({
      success: false,
      message: "eventId and a non-empty seatNumbers array are required.",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const seats = await Seat.find({
      eventId,
      seatNumber: { $in: seatNumbers },
    }).session(session);

    if (seats.length !== seatNumbers.length) {
      const found = seats.map((s) => s.seatNumber);
      const missing = seatNumbers.filter((n) => !found.includes(n));
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: `Seat(s) not found: ${missing.join(", ")}`,
      });
    }

    const unavailable = seats.filter((s) => s.status !== "available");
    if (unavailable.length > 0) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: `Seat(s) already reserved or booked: ${unavailable.map((s) => s.seatNumber).join(", ")}`,
      });
    }

    const seatIds = seats.map((s) => s._id);
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { $set: { status: "reserved" } },
      { session }
    );

    const expiresAt = new Date(Date.now() + RESERVATION_TTL_MINUTES * 60 * 1000);

    const [reservation] = await Reservation.create(
      [{ userId, eventId, seatIds, expiresAt }],
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Seats reserved successfully. You have 5 minutes to confirm.",
      reservation: {
        id: reservation._id,
        seatNumbers,
        expiresAt,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    if (error.errorLabels?.includes("TransientTransactionError")) {
      return res.status(409).json({
        success: false,
        message: "Reservation conflict — another user just reserved one of these seats. Please try again.",
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};
