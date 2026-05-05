import Category from "../models/Category.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: "Category not found" });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  const { name, slug, description, image } = req.body;
  const categoryExists = await Category.findOne({ slug });

  if (categoryExists) {
    return res.status(400).json({ message: "Category with this slug already exists" });
  }

  const category = new Category({
    name,
    slug,
    description,
    image,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  const { name, slug, description, image, isActive } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.description = description || category.description;
    category.image = image || category.image;
    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404).json({ message: "Category not found" });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.deleteOne({ _id: category._id });
    res.json({ message: "Category removed" });
  } else {
    res.status(404).json({ message: "Category not found" });
  }
};
