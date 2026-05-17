const mongoose = require("mongoose");
const dotenv = require("dotenv")
const Event = require("./models/Event");
const events = require("./data/events");

dotenv.config();

const seedEvents = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    await Event.deleteMany();
    const insertedEvents = await Event.insertMany(events);

    console.log(`${insertedEvents.length} events inserted`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seedEvents();
