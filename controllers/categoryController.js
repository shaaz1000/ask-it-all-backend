const Category = require("../models/Category");

// Create a new category
exports.createNewCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const newCategory = new Category({ categoryName });
    await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Read all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Read a single category by ID
exports.getSingleCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { categoryName } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { categoryName },
      { new: true }
    );
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Category updated successfully",
        category: updatedCategory,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
