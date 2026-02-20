const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    age: { type: Number, min: 1, max: 120 },
    gender: { type: String, enum: ["Male", "Female", "Other"] },

    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // "HH:mm"
    endTime: { type: String, required: true },   // "HH:mm"

    artist: { type: String, required: true, trim: true },
    serviceType: { type: String, trim: true },
    services: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    filledBy: { type: String, trim: true },

    subtotal: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    discountAmount: { type: Number, default: 0, min: 0 },
    finalTotal: { type: Number, required: true, min: 0 },

    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    razorpayPaymentId: { type: String, default: null },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Index for common analytics queries
visitSchema.index({ date: 1 });
visitSchema.index({ artist: 1, date: 1 });
visitSchema.index({ contact: 1 });

module.exports = mongoose.model("Visit", visitSchema);
