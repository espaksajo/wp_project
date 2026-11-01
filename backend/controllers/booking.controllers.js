import mongoose from "mongoose";
import Seat from "../models/seat.models.js";
import Reservation from "../models/reservation.models.js";
import Booking from "../models/booking.models.js";
import Event from "../models/event.models.js";

const generateBookingId = () =>
  "BKG-" + Math.random().toString(36).substring(2, 8).toUpperCase();

export const bookSeats = async (req, res) => {
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

    const reservation = await Reservation.findOne({
      userId,
      eventId,
      expiresAt: { $gt: new Date() },
    }).session(session);

    if (!reservation) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "No valid reservation found. It may have expired or does not exist.",
      });
    }

    const reservedSeats = await Seat.find({
      _id: { $in: reservation.seatIds },
    }).session(session);

    const reservedNumbers = reservedSeats.map((s) => s.seatNumber);
    const notReserved = seatNumbers.filter((n) => !reservedNumbers.includes(n));

    if (notReserved.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Seat(s) not part of your reservation: ${notReserved.join(", ")}`,
      });
    }

    // Mark seats as booked
    await Seat.updateMany(
      { _id: { $in: reservation.seatIds } },
      { $set: { status: "booked" } },
      { session }
    );

    // Get the event to use its ticket price as a fallback for legacy seats
    const event = await Event.findById(eventId).session(session);
    const fallbackPrice = event?.ticketPrice || 500;

    // Calculate total from seat prices
    const totalAmount = reservedSeats.reduce((sum, s) => sum + (s.price || fallbackPrice), 0);

    // Save booking record
    const bookingId = generateBookingId();
    const booking = await Booking.create(
      [{ userId, eventId, seatNumbers, totalAmount, bookingId }],
      { session }
    );

    // Remove reservation
    await Reservation.findByIdAndDelete(reservation._id, { session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Booking confirmed!",
      booking: {
        bookingId,
        userId,
        eventId,
        seatNumbers,
        totalAmount,
        bookedAt: new Date(),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    if (error.errorLabels?.includes("TransientTransactionError")) {
      return res.status(409).json({
        success: false,
        message: "Booking conflict — please try again.",
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("eventId", "name venue date imageUrl category ticketPrice");

    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
