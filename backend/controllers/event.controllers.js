import Event from "../models/event.models.js";
import Seat from "../models/seat.models.js";
import Reservation from "../models/reservation.models.js";

const generateSeatDocs = (eventId, rows, cols, basePrice) => {
  const seats = [];
  for (const row of rows) {
    for (let col = 1; col <= cols; col++) {
      seats.push({ 
        eventId, 
        seatNumber: `${row}${col}`, 
        status: "available",
        price: basePrice 
      });
    }
  }
  return seats;
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res.status(200).json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    const seats = await Seat.find({ eventId: event._id }).sort({ seatNumber: 1 });
    return res.status(200).json({ success: true, event, seats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { name, date, venue, totalSeats, description, category, rows, cols, ticketPrice } = req.body;

    if (!name || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: "name, date, and venue are required.",
      });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const finalPrice = ticketPrice ? Number(ticketPrice) : 500;
    const seatRows = rows ? JSON.parse(rows) : ["A", "B", "C", "D", "E"];
    const seatCols = cols ? Number(cols) : 10;
    const finalTotalSeats = totalSeats ? Number(totalSeats) : seatRows.length * seatCols;

    const event = await Event.create({
      name,
      date,
      venue,
      totalSeats: finalTotalSeats,
      description: description || "",
      category: category || "General",
      imageUrl,
      ticketPrice: finalPrice,
      ownerId: req.user._id,
    });

    const seatDocs = generateSeatDocs(event._id, seatRows, seatCols, finalPrice);
    await Seat.insertMany(seatDocs);

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event,
      seatsCreated: seatDocs.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const listUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view another user's events.",
      });
    }
    const events = await Event.find({ ownerId: userId }).sort({ date: 1 });
    return res.status(200).json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    if (!event.ownerId || event.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event.",
      });
    }
    await Seat.deleteMany({ eventId: event._id });
    await Reservation.deleteMany({ eventId: event._id });
    await Event.findByIdAndDelete(event._id);
    return res.status(200).json({
      success: true,
      message: "Event and all related seats/reservations deleted.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
