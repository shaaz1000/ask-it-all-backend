const Mentor = require("../models/Mentor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Signup
exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      socialHandles,
      ratePerHour,
      description,
      education,
      workExperience,
      availableTimeSlots,
      category,
    } = req.body;

    const mentorExists = await Mentor.findOne({ email });
    if (mentorExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const newMentor = new Mentor({
      name,
      email,
      password,
      socialHandles,
      ratePerHour,
      description,
      education,
      workExperience,
      availableTimeSlots,
      category,
    });

    await newMentor.save();

    const token = jwt.sign({ id: newMentor._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "Mentor created successfully",
      mentor: newMentor,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const mentor = await Mentor.findOne({ email });

    if (!mentor) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found" });
    }

    const isMatch = await mentor.comparePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: mentor._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      mentor,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all mentors
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isOnline: true }).populate("category");

    const currentDate = new Date();

    // Filter and sort the available time slots for each mentor
    const updatedMentors = mentors.map((mentor) => {
      mentor.availableTimeSlots = mentor.availableTimeSlots
        .map((slot) => {
          if (new Date(slot.date) < currentDate) {
            return {
              ...slot,
              timeSlots: [],
            };
          }
          return slot;
        })
        .filter(
          (slot) =>
            new Date(slot.date) >= currentDate || slot.timeSlots.length > 0
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting by date in ascending order

      return mentor;
    });

    res.status(200).json({ success: true, mentors: updatedMentors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Mentor by ID
exports.getMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate("category");

    if (!mentor) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found" });
    }

    if (!mentor.isOnline) {
      return res
        .status(400)
        .json({ success: false, message: "Mentor is not online" });
    }

    const currentDate = new Date();

    // Filter and sort the available time slots
    mentor.availableTimeSlots = mentor.availableTimeSlots
      .map((slot) => {
        if (new Date(slot.date) < currentDate) {
          return {
            ...slot,
            timeSlots: [],
          };
        }
        return slot;
      })
      .filter(
        (slot) =>
          new Date(slot.date) >= currentDate || slot.timeSlots.length > 0
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting by date in ascending order

    res.status(200).json({ success: true, mentor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Mentor by ID
exports.updateMentor = async (req, res) => {
  try {
    const updatedData = req.body;

    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found" });
    }

    if (updatedData.availableTimeSlots) {
      updatedData.availableTimeSlots.forEach((newSlot) => {
        const existingSlot = mentor.availableTimeSlots.find(
          (slot) =>
            new Date(slot.date).toISOString() ===
            new Date(newSlot.date).toISOString()
        );

        if (existingSlot) {
          newSlot.timeSlots.forEach((newTimeSlot) => {
            if (
              !existingSlot.timeSlots.some(
                (timeSlot) =>
                  timeSlot.from === newTimeSlot.from &&
                  timeSlot.to === newTimeSlot.to
              )
            ) {
              existingSlot.timeSlots.push(newTimeSlot);
            }
          });
        } else {
          mentor.availableTimeSlots.push(newSlot);
        }
      });

      // Ensure unique time slots within the same date
      mentor.availableTimeSlots = mentor.availableTimeSlots.map((slot) => {
        const uniqueTimeSlots = [];
        const seenTimeSlots = new Set();

        slot.timeSlots.forEach((timeSlot) => {
          const slotString = `${timeSlot.from}-${timeSlot.to}`;
          if (!seenTimeSlots.has(slotString)) {
            uniqueTimeSlots.push(timeSlot);
            seenTimeSlots.add(slotString);
          }
        });

        return {
          ...slot,
          timeSlots: uniqueTimeSlots,
        };
      });
    }

    // Exclude availableTimeSlots from updatedData to avoid overwriting
    delete updatedData.availableTimeSlots;

    Object.assign(mentor, updatedData);
    await mentor.save();

    res
      .status(200)
      .json({ success: true, message: "Mentor updated successfully", mentor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Delete Mentor by ID
exports.deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);

    if (!mentor) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Mentor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
