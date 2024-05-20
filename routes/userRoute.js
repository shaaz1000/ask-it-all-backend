const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const auth = require("../middleware/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
