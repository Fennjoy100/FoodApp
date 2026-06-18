import User from "../models/userModel.js";
import Pizza from "../models/pizzaModel.js";
import Order from "../models/orderModel.js";

// Get Dashboard Statistics
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalPizzas = await Pizza.countDocuments();
    const availablePizzas = await Pizza.countDocuments({ isAvailable: true });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    
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

    const topPizzas = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.pizza",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "pizzas",
          localField: "_id",
          foreignField: "_id",
          as: "pizzaDetails",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users: { total: totalUsers, customers: totalCustomers, admins: totalAdmins },
        pizzas: { total: totalPizzas, available: availablePizzas },
        orders: { total: totalOrders, pending: pendingOrders },
        revenue: totalRevenue[0]?.total || 0,
        ordersByStatus,
        topPizzas,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get All Users (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Update User Role (Admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["customer", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete User (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Don't allow deleting the only admin
    const adminCount = await User.countDocuments({ role: "admin" });
    const user = await User.findById(id);

    if (user?.role === "admin" && adminCount === 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the only admin user",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get Recent Orders (Admin)
export const getRecentOrders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const orders = await Order.find()
      .populate("customerId", "name email")
      .populate("items.pizza", "name price")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get Order by ID with full details (Admin)
export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customerId")
      .populate("items.pizza");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Search Orders (Admin)
export const searchOrders = async (req, res, next) => {
  try {
    const { query, status, startDate, endDate } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    let orders = await Order.find(filter)
      .populate("customerId", "name email")
      .populate("items.pizza", "name price")
      .sort({ createdAt: -1 });

    if (query) {
      orders = orders.filter(
        (order) =>
          order.customerId.name.toLowerCase().includes(query.toLowerCase()) ||
          order.customerId.email.toLowerCase().includes(query.toLowerCase()) ||
          order._id.toString().includes(query)
      );
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get Pizza Analytics (Admin)
export const getPizzaAnalytics = async (req, res, next) => {
  try {
    const pizzaStats = await Pizza.aggregate([
      {
        $lookup: {
          from: "orders",
          let: { pizzaId: "$_id" },
          pipeline: [
            {
              $unwind: "$items",
            },
            {
              $match: {
                $expr: { $eq: ["$items.pizza", "$$pizzaId"] },
              },
            },
          ],
          as: "orders",
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          category: 1,
          isAvailable: 1,
          totalOrders: { $size: "$orders" },
          totalRevenue: {
            $sum: {
              $map: {
                input: "$orders",
                as: "order",
                in: { $multiply: ["$$order.items.price", "$$order.items.quantity"] },
              },
            },
          },
        },
      },
      { $sort: { totalOrders: -1 } },
    ]);

    res.status(200).json({
      success: true,
      analytics: pizzaStats,
    });
  } catch (error) {
    next(error);
  }
};

// Export Reports (Admin) - Revenue Report
export const getRevenueReport = async (req, res, next) => {
  try {
    const { period } = req.query; // daily, weekly, monthly, yearly

    let dateFormat = "%Y-%m-%d";
    if (period === "weekly") dateFormat = "%Y-W%V";
    else if (period === "monthly") dateFormat = "%Y-%m";
    else if (period === "yearly") dateFormat = "%Y";

    const report = await Order.aggregate([
      {
        $match: { status: "Delivered" },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};
