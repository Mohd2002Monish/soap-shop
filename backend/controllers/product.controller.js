import Product from "../models/Product.js";
import Category from "../models/Category.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.search
    ? {
        name: {
          $regex: req.query.search,
          $options: "i",
        },
      }
    : {};

  const categoryFilter = req.query.category ? { category: req.query.category } : {};
  const priceFilter = {};
  if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);

  const query = {
    ...keyword,
    ...categoryFilter,
    isActive: true,
  };

  if (Object.keys(priceFilter).length > 0) {
    query.price = priceFilter;
  }

  let sortCriteria = {};
  if (req.query.sort === "lowest") {
    sortCriteria = { price: 1 };
  } else if (req.query.sort === "highest") {
    sortCriteria = { price: -1 };
  } else if (req.query.sort === "newest") {
    sortCriteria = { createdAt: -1 };
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate("category", "name slug")
    .sort(sortCriteria)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate("category", "name slug")
    .limit(8);
  res.json(products);
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res) => {
  const products = await Product.find({ isActive: true })
    .sort({ "ratings.average": -1 })
    .limit(4);
  res.json(products);
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
    "category",
    "name slug"
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const {
    name,
    slug,
    price,
    discountPrice,
    description,
    shortDescription,
    category,
    stock,
    sku,
    ingredients,
    weight,
    scent,
    isFeatured,
    isActive,
    images,
  } = req.body;

  const product = new Product({
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    price,
    discountPrice,
    description,
    shortDescription,
    category,
    stock,
    sku,
    ingredients,
    weight,
    scent,
    isFeatured: isFeatured || false,
    isActive: isActive !== undefined ? isActive : true,
    images: images || [],
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const {
    name,
    slug,
    price,
    discountPrice,
    description,
    shortDescription,
    category,
    stock,
    sku,
    ingredients,
    weight,
    scent,
    isFeatured,
    isActive,
    images,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.slug = slug || product.slug;
    product.price = price || product.price;
    product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
    product.description = description || product.description;
    product.shortDescription = shortDescription || product.shortDescription;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.sku = sku || product.sku;
    product.ingredients = ingredients || product.ingredients;
    product.weight = weight || product.weight;
    product.scent = scent || product.scent;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isActive = isActive !== undefined ? isActive : product.isActive;
    if (images !== undefined) product.images = images;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// @desc    Delete a product (Soft Delete usually or Hard Delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.isActive = false;
    await product.save();
    res.json({ message: "Product removed (soft delete)" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};
