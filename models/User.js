const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    mentorsList: [
      {
        mentor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Mentor",
        },
        isCurrent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    contactNumber: {
      type: String,
      required: true,
    },
    totalCreditsAvailable: {
      type: Number,
      default: 0,
    },
    education: [
      {
        universityName: {
          type: String,
          default: "Unknown",
        },
        degree: {
          type: String,
          default: "Unknown",
        },
        passingYear: {
          type: Number,
          default: new Date().getFullYear(),
        },
        cgpa: {
          type: Number,
          default: null,
        },
      },
    ],
    workExperience: [
      {
        companyName: {
          type: String,
          default: "Unknown",
        },
        designationHistory: [
          {
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
    timestamps: true,
  }
);

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
