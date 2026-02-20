const mongoose = require("mongoose");

let connectionPromise = null;

async function connectDB() {
  // Already connected
  if (mongoose.connection.readyState === 1) return;

  // If disconnecting, wait for it to finish then reconnect
  if (mongoose.connection.readyState === 3) {
    await new Promise((r) => mongoose.connection.once("disconnected", r));
  }

  // Connection in progress — wait for it
  if (connectionPromise) return connectionPromise;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  console.log("Connecting to MongoDB...");
  connectionPromise = mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,  // fail fast instead of waiting 30s
      socketTimeoutMS: 45000,
    })
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
      connectionPromise = null; // allow retry on failure
      throw err;
    });

  return connectionPromise;
}

module.exports = connectDB;
