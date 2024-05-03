const mongoose = require("mongoose");

// Define Booking schema
const bookingSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    concept: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create Booking model
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
