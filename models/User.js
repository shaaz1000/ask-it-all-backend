const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserType = {
  Mentor: "MENTOR",
  Mentee: "MENTEE",
};
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Indexing the email field for faster query performance
    },
    userType: {
      type: String,
      default: UserType.Mentee,
      index: true, // Indexing the userType field for faster query performance
    },
    password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    education: [
      {
        universityName: {
          type: String,
          default: "Unknown", // Default value for universityName
        },
        degree: {
          type: String,
          default: "Unknown", // Default value for universityName
        },
        passingYear: {
          type: Number,
          default: new Date().getFullYear(),
        },
        cgpa: {
          type: Number,
          default: null, // Setting cgpa to null if not provided
        },
      },
    ],
    workExperience: [
      {
        companyName: {
          type: String,
          default: "Unknown", // Default value for companyName
        },
        designationHistory: [
          {
            designation: {
              type: String,
              default: "Unknown", // Default value for designation
            },
            fromDate: {
              type: Date,
              default: Date.now, // Default value for fromDate
            },
            toDate: {
              type: Date,
              default: null,
            },
          },
        ],
        jobDescription: {
          type: String,
          default: "No job description available",
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save hook to hash password before saving
UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = mongoose.model("User", UserSchema);
