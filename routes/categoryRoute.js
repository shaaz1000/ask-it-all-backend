const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Create a new category
router.post("/", categoryController.createNewCategory);

// Read all categories
router.get("/", categoryController.getCategories);

// Read a single category by ID
router.get("/:categoryId", categoryController.getSingleCategory);

// Update a category
router.put("/:categoryId", categoryController.updateCategory);

// Route to delete a category
router.delete("/:categoryId", categoryController.deleteCategory);

// Route to delete a subcategory
router.delete(
  "/:categoryId/subcategories/:subcategoryId",
  categoryController.deleteCategory
);

module.exports = router;
