const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    console.log("ACTUAL URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully (Bypassed SRV)");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;