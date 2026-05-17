const Booking = require("../models/Booking");
const Event = require("../models/Event");
const OTP = require("../models/OTP");
const { sendBookingEmail, sendOTPEmail } = require("../utils/email");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.sendBookingOTP = async (req, res) => {
  try {
    const otp = generateOTP();
    await OTP.findOneAndDelete({
      email: req.user.email,
      action: "event_booking",
    });
    await OTP.create({ email: req.user.email, otp, action: "event_booking" });
    await sendOTPEmail(req.user.email, otp, "event_booking");
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

exports.bookEvent = async (req, res) => {
  try {
    const { eventId, otp } = req.body;

    const validOTP = await OTP.findOne({
      email: req.user.email,
      otp,
      action: "event_booking",
    });
    if (!validOTP) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP for booking" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.availableSeats <= 0)
      return res.status(400).json({ message: "No seats available" });

    const existingBooking = await Booking.findOne({
      userId: req.user.id,
      eventId,
    });
    if (existingBooking && existingBooking.status !== "cancelled") {
      return res.status(400).json({ message: "Already booked or pending" });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      eventId,
      status: "pending",
      paymentStatus: "unpaid",
      amount: event.ticketPrice,
    });

    await OTP.deleteOne({ _id: validOTP._id });

    res.status(201).json({ message: "Booking request submitted", booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
exports.confirmBooking = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("userId")
      .populate("eventId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (!booking.eventId || !booking.userId) {
      await Booking.findByIdAndDelete(req.params.id);

      return res.status(400).json({
        message: "Invalid booking removed automatically",
      });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({
        message: "Booking already confirmed",
      });
    }

    let event = null;

    if (booking.eventId?._id) {
      event = await Event.findById(booking.eventId._id);
    }

    if (event && event.availableSeats <= 0) {
      return res.status(400).json({
        message: "No seats available",
      });
    }

    booking.status = "confirmed";

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();

    if (event) {
      event.availableSeats -= 1;
      await event.save();
    }

    if (booking.userId?.email) {
      await sendBookingEmail(
        booking.userId.email,
        booking.userId.name,
        booking.eventId?.title || "Deleted Event",
      );
    }

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (error) {
    console.log("CONFIRM ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMyBookings = async (req, res) => {
  try {
    const bookings =
      req.user.role === "admin"
        ? await Booking.find()
            .populate("eventId", "title")
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
        : await Booking.find({ userId: req.user.id })
            .populate("eventId", "title")
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

    const validBookings = bookings.filter((b) => b.eventId && b.userId);

    res.json(validBookings);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Booking removed successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
