const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Create a new category
router.post("/categories", categoryController.createNewCategory);

// Read all categories
router.get("/categories", categoryController.getCategories);

// Read a single category by ID
router.get("/categories/:categoryId", categoryController.getSingleCategory);

// Update a category
router.put("/categories/:categoryId", categoryController.updateCategory);

// Delete a category
router.delete("/categories/:categoryId", categoryController.deleteCategory);

module.exports = router;
