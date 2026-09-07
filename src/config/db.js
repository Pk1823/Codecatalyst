const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionDB = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connectionDB.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
