const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schema for Education
const educationSchema = new mongoose.Schema({
  universityName: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  passingYear: {
    type: Number,
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
  },
});

// Schema for Designation History
const designationHistorySchema = new mongoose.Schema({
  designation: {
    type: String,
    default: "Unknown",
  },
  fromDate: {
    type: Date,
    default: Date.now,
  },
  toDate: {
    type: Date,
    default: null,
  },
});

// Schema for Work Experience
const workExperienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: "Unknown",
  },
  designationHistory: [designationHistorySchema],
  jobDescription: {
    type: String,
    default: "No job description available",
  },
});

// Schema for Available Time Slots
const availableTimeSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [
    {
      from: {
        type: String,
        required: true,
      },
      to: {
        type: String,
        required: true,
      },
    },
  ],
});

// Schema for Social Handles
const socialHandleSchema = new mongoose.Schema({
  handleName: {
    type: String,
    required: true,
  },
  handleLink: {
    type: String,
    required: true,
  },
});

// Main Mentor Schema
const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    socialHandles: [socialHandleSchema],
    isOnline: {
      type: Boolean,
      default: true,
    },
    ratePerHour: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    education: [educationSchema],
    workExperience: [workExperienceSchema],
    availableTimeSlots: [availableTimeSlotSchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the mentor
mentorSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to compare password for login
mentorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Mentor = mongoose.model("Mentor", mentorSchema);

module.exports = Mentor;
