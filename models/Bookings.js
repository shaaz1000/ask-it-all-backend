const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingDateTime: {
      type: Date,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Scheduled", "Cancelled", "Declined"],
      default: "Pending",
    },
    totalCost: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true, // Duration in minutes or hours, depending on your needs
    },
    questionsAsked: [
      {
        type: String,
      },
    ],
    agoraId: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Booking", BookingSchema);
