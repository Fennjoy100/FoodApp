import Order from "../models/orderModel.js";

// Place Order
export const placeOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;

    // Validation
    if (!items || items.length === 0 || !totalAmount || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Please provide items, total amount, and delivery address",
      });
    }

    const order = new Order({
      customerId: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
    });

    await order.save();
    await order.populate("items.pizza");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get Customer's Orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate("items.pizza")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email")
      .populate("items.pizza")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("customerId", "name email")
      .populate("items.pizza");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Order
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order is in Pending status
    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Can only cancel orders with Pending status",
      });
    }

    // Check if user is owner or admin
    if (order.customerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get Order Statistics (Admin)
export const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};
