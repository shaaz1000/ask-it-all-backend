const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { email, password, contactNumber } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const defaultValue = "Unknown";
    user = new User({
      email,
      password,
      contactNumber,
      education: [
        {
          universityName: defaultValue,
          degree: defaultValue,
          passingYear: new Date().getFullYear(),
          cgpa: null,
        },
      ],
      workExperience: [
        {
          companyName: defaultValue,
          designationHistory: [
            {
              designation: defaultValue,
              fromDate: null,
              toDate: null,
            },
          ],
          jobDescription: defaultValue,
        },
      ],
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res
      .status(201)
      .send({ user, message: "User created successfully", token });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      console.log("Login failed! Check authentication credentials");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Return user and token in response
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update work experience for user
exports.updateUserWorkExperience = async (req, res) => {
  const userId = req.params.userId;
  const experienceId = req.params.experienceId;
  const { companyName, designation, fromDate, toDate, jobDescription } =
    req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    // Find the work experience record to update
    const experienceIndex = user.workExperience.findIndex(
      (exp) => exp._id == experienceId
    );
    const experienceToUpdate = user.workExperience[experienceIndex];

    // Update the fields
    experienceToUpdate.companyName = companyName;
    experienceToUpdate.designationHistory = [
      {
        designation,
        fromDate,
        toDate,
      },
    ];
    experienceToUpdate.jobDescription = jobDescription;

    // Save the updated user document
    await user.save();

    res.status(200).json({
      user,
      success: true,
      message: "Work experience updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update education for a user
exports.updateEducation = async (req, res) => {
  const userId = req.params.userId;
  const educationId = req.params.educationId;
  const { universityName, degree, passingYear, cgpa } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    // Find the education record to update
    const educationIndex = user.education.findIndex(
      (edu) => edu._id == educationId
    );
    const educationToUpdate = user.education[educationIndex];

    // Update the fields
    educationToUpdate.universityName = universityName;
    educationToUpdate.degree = degree;
    educationToUpdate.passingYear = passingYear;
    educationToUpdate.cgpa = cgpa;

    // Save the updated user document
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Education updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete work experience for a user
exports.deleteWorkExperience = async (req, res) => {
  const userId = req.params.userId;
  const experienceId = req.params.experienceId;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    // Find the index of the work experience record to delete
    const experienceIndex = user.workExperience.findIndex(
      (exp) => exp._id == experienceId
    );

    // Check if the work experience record exists
    if (experienceIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience record not found" });
    }

    // Remove the work experience record from the array
    user.workExperience.splice(experienceIndex, 1);

    // Save the updated user document
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Work experience deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete educations for a user
exports.deleteEducation = async (req, res) => {
  const userId = req.params.userId;
  const educationId = req.params.educationId;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    // Find the index of the education record to delete
    const educationIndex = user.education.findIndex(
      (edu) => edu._id == educationId
    );

    // Check if the education record exists
    if (educationIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Education record not found" });
    }

    // Remove the education record from the array
    user.education.splice(educationIndex, 1);

    // Save the updated user document
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Education deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
