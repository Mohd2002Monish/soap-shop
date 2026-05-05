import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  
  const orders = await Order.find({ status: { $ne: "cancelled" } });
  const totalRevenue = orders.reduce((acc, item) => acc + item.grandTotal, 0);

  res.json({
    totalOrders,
    totalUsers,
    totalProducts,
    totalRevenue,
  });
};

// @desc    Get recent orders
// @route   GET /api/dashboard/recent-orders
// @access  Private/Admin
export const getRecentOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(10);
  res.json(orders);
};

// @desc    Get top products
// @route   GET /api/dashboard/top-products
// @access  Private/Admin
export const getTopProducts = async (req, res) => {
  // Aggregate from orders to find best selling products
  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.name" },
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  res.json(topProducts);
};

// @desc    Get revenue chart data
// @route   GET /api/dashboard/revenue
// @access  Private/Admin
export const getRevenueData = async (req, res) => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const revenueData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: last30Days },
        status: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$grandTotal" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json(revenueData);
};
