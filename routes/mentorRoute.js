const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const auth = require("../middleware/auth");

router.post("/signup", mentorController.signup);
router.post("/login", mentorController.login);

// router.get("/", auth, mentorController.getAllMentors);
// router.get("/:id", auth, mentorController.getMentor);
// router.put("/:id", auth, mentorController.updateMentor);
// router.delete("/:id", auth, mentorController.deleteMentor);
router.get("/", mentorController.getAllMentors);
router.get("/:id", mentorController.getMentor);
router.put("/:id", mentorController.updateMentor);
router.delete("/:id", mentorController.deleteMentor);

module.exports = router;
