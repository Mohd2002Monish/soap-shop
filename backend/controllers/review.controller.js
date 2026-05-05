import Review from "../models/Review.js";
import Product from "../models/Product.js";

// @desc    Get approved reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  const reviews = await Review.find({
    product: req.params.productId,
    isApproved: true,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json(reviews);
};

// @desc    Submit a review
// @route   POST /api/reviews/product/:productId
// @access  Private
export const submitReview = async (req, res) => {
  const { rating, title, body } = req.body;
  const productId = req.params.productId;

  // Ideally, check if user purchased the product
  // For now, we allow any logged in user to review

  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    return res.status(400).json({ message: "Product already reviewed" });
  }

  const review = new Review({
    product: productId,
    user: req.user._id,
    rating: Number(rating),
    title,
    body,
    isApproved: false, // Requires admin approval
  });

  await review.save();
  res.status(201).json({ message: "Review submitted and waiting for approval" });
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name")
    .populate("product", "name")
    .sort({ createdAt: -1 });
  res.json(reviews);
};

// @desc    Approve a review
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    review.isApproved = true;
    await review.save();

    // Recalculate product rating
    const approvedReviews = await Review.find({ product: review.product, isApproved: true });
    const product = await Product.findById(review.product);
    
    if (product) {
      product.ratings.count = approvedReviews.length;
      product.ratings.average =
        approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length;
      await product.save();
    }

    res.json({ message: "Review approved" });
  } else {
    res.status(404).json({ message: "Review not found" });
  }
};

// @desc    Delete any review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    const productId = review.product;
    await Review.deleteOne({ _id: review._id });

    // Recalculate product rating
    const approvedReviews = await Review.find({ product: productId, isApproved: true });
    const product = await Product.findById(productId);
    
    if (product) {
      product.ratings.count = approvedReviews.length;
      product.ratings.average = approvedReviews.length > 0 ?
        approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length : 0;
      await product.save();
    }

    res.json({ message: "Review deleted" });
  } else {
    res.status(404).json({ message: "Review not found" });
  }
};
