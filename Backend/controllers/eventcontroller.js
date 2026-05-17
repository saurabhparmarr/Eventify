const Event = require("../models/Event.js");
const Booking = require("../models/Booking.js");

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const search = req.query.search || "";

    const events = await Event.find({
      $or: [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          location: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await Booking.deleteMany({
      eventId: req.params.id,
    });

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log("DELETE EVENT ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
