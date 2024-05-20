const Booking = require("../models/Bookings");

// create booking
exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    // Check if all required fields are present
    const requiredFields = [
      "mentorId",
      "userId",
      "bookingDateTime",
      "categoryId",
      "totalCost",
      "duration",
      "agoraId",
    ];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return res
          .status(400)
          .json({ success: false, message: `${field} is required` });
      }
    }

    const newBooking = new Booking(bookingData);
    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get single booking based on booking it
exports.getBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId)
      .populate("mentorId")
      .populate("userId")
      .populate("categoryId");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("mentorId")
      .populate("userId")
      .populate("categoryId");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get all bookings for a particular user
exports.getBookingsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ userId })
      .populate("mentorId")
      .populate("categoryId");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get all bookings for particular mentor
exports.getBookingsByMentor = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    const bookings = await Booking.find({ mentorId })
      .populate("userId")
      .populate("categoryId");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get all bookings for particular category
exports.getBookingsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const bookings = await Booking.find({ categoryId })
      .populate("mentorId")
      .populate("userId");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// update bookings
exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const updateData = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// delete bookings
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      booking: deletedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
