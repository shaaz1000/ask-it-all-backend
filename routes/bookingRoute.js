const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Create a new booking
router.post("/", bookingController.createBooking);

// Get all bookings
router.get("/", bookingController.getAllBookings);

// Get a booking by ID
router.get("/:bookingId", bookingController.getBooking);

// Get all bookings for a particular user
router.get("/user/:userId", bookingController.getBookingsByUser);

// Get all bookings for a particular mentor
router.get("/mentor/:mentorId", bookingController.getBookingsByMentor);

// Get all bookings for a particular category
router.get("/category/:categoryId", bookingController.getBookingsByCategory);

// Update a booking by ID
router.put("/:bookingId", bookingController.updateBooking);

// Delete a booking by ID
router.delete("/:bookingId", bookingController.deleteBooking);

module.exports = router;
