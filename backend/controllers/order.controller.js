import Order from "../models/Order.js";
import User from "../models/User.js";

// @desc    Create new order (works for both guests and logged-in users)
// @route   POST /api/orders
// @access  Public (guest) or Private (logged-in)
export const addOrderItems = async (req, res) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    itemsTotal,
    shippingCharge,
    discount,
    grandTotal,
    notes,
    guestId,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const order = new Order({
    orderNumber,
    user: req.user?._id || undefined,  // optional for guests
    guestId: !req.user ? guestId : undefined,
    items,
    shippingAddress,
    paymentMethod,
    itemsTotal,
    shippingCharge,
    discount,
    grandTotal,
    notes,
  });

  order.statusHistory.push({ status: "pending", note: "Order placed successfully" });

  const createdOrder = await order.save();

  // If logged-in user, save phone + address to their profile for future pre-fill
  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user) {
      // Save phone if not already set
      if (shippingAddress.phone && !user.phone) {
        user.phone = shippingAddress.phone;
      }
      // Add address if not a duplicate street
      const alreadySaved = user.addresses.some(
        (a) => a.street?.toLowerCase() === shippingAddress.street?.toLowerCase()
      );
      if (!alreadySaved && shippingAddress.street) {
        user.addresses.push({
          label: "Home",
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          isDefault: user.addresses.length === 0,
        });
      }
      await user.save();
    }
  }

  res.status(201).json(createdOrder);
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Get single order detail (for user)
// @route   GET /api/orders/my/:id
// @access  Private
export const getMyOrderById = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Cancel order (only if pending)
// @route   DELETE /api/orders/my/:id
// @access  Private
export const cancelMyOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (order) {
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }
    order.status = "cancelled";
    order.statusHistory.push({ status: "cancelled", note: "Cancelled by customer" });
    await order.save();
    res.json({ message: "Order cancelled" });
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.search
    ? {
        orderNumber: {
          $regex: req.query.search,
          $options: "i",
        },
      }
    : {};

  const statusFilter = req.query.status ? { status: req.query.status } : {};

  const query = { ...keyword, ...statusFilter };

  const count = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate("user", "id name")
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ orders, page, pages: Math.ceil(count / pageSize), count });
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    order.statusHistory.push({ status, note });

    // if delivered and COD, we can assume payment received
    if (status === "delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "received";
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Mark payment as received
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
export const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.paymentStatus = "received";
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Add admin note to order
// @route   PUT /api/orders/:id/note
// @access  Private/Admin
export const addAdminNote = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.adminNote = req.body.adminNote;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};
