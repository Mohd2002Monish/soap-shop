import Coupon from "../models/Coupon.js";

// @desc    Validate and apply coupon code
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = async (req, res) => {
  const { code, orderAmount } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return res.status(404).json({ message: "Invalid coupon code" });
  }

  if (!coupon.isActive) {
    return res.status(400).json({ message: "Coupon is no longer active" });
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return res.status(400).json({ message: "Coupon has expired" });
  }

  if (orderAmount < coupon.minOrderAmount) {
    return res.status(400).json({
      message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
    });
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ message: "Coupon usage limit reached" });
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === "flat") {
    discountAmount = coupon.discountValue;
  } else if (coupon.discountType === "percent") {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  }

  res.json({
    _id: coupon._id,
    code: coupon.code,
    discountAmount,
  });
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    usageLimit,
    expiresAt,
  } = req.body;

  const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

  if (couponExists) {
    return res.status(400).json({ message: "Coupon code already exists" });
  }

  const coupon = new Coupon({
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    usageLimit,
    expiresAt,
  });

  const createdCoupon = await coupon.save();
  res.status(201).json(createdCoupon);
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    coupon.code = req.body.code || coupon.code;
    coupon.discountType = req.body.discountType || coupon.discountType;
    coupon.discountValue = req.body.discountValue || coupon.discountValue;
    coupon.minOrderAmount = req.body.minOrderAmount || coupon.minOrderAmount;
    coupon.maxDiscount = req.body.maxDiscount || coupon.maxDiscount;
    coupon.usageLimit = req.body.usageLimit || coupon.usageLimit;
    coupon.isActive = req.body.isActive !== undefined ? req.body.isActive : coupon.isActive;
    coupon.expiresAt = req.body.expiresAt || coupon.expiresAt;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } else {
    res.status(404).json({ message: "Coupon not found" });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await Coupon.deleteOne({ _id: coupon._id });
    res.json({ message: "Coupon removed" });
  } else {
    res.status(404).json({ message: "Coupon not found" });
  }
};
