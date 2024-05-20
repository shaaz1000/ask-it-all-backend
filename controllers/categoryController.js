const Category = require("../models/Category");

// Create a new category
exports.createNewCategory = async (req, res) => {
  try {
    const { categoryName, subcategories } = req.body;

    // Create a new Category with categoryName and subcategories
    const newCategory = new Category({
      categoryName,
      subcategories, // Assumes subcategories is an array of objects with subcategoryName field
    });

    // Save the new category to the database
    await newCategory.save();

    // Respond with success
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
    const { categoryName, subcategories } = req.body;

    // Determine the update data
    let updateData = {};
    if (categoryName) updateData.categoryName = categoryName;
    if (subcategories) updateData.subcategories = subcategories;

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
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
    const { categoryId, subcategoryId } = req.params;

    if (subcategoryId) {
      // Delete a specific subcategory
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { $pull: { subcategories: { _id: subcategoryId } } },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: "Category or Subcategory not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Subcategory deleted successfully",
        category: updatedCategory,
      });
    } else {
      // Delete the entire category
      const deletedCategory = await Category.findByIdAndDelete(categoryId);

      if (!deletedCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        category: deletedCategory,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
