const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.put(
  "/:userId/work-experience/:experienceId",
  userController.updateUserWorkExperience
);
router.put("/:userId/education/:educationId", userController.updateEducation);
router.delete(
  "/:userId/work-experience/:experienceId",
  userController.deleteWorkExperience
);
router.delete(
  "/:userId/education/:educationId",
  userController.deleteEducation
);

module.exports = router;
