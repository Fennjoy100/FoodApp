import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getRecentOrders,
  getOrderDetails,
  searchOrders,
  getPizzaAnalytics,
  getRevenueReport,
} from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken, isAdmin);

// Dashboard & Analytics
router.get("/dashboard/stats", getDashboardStats);
router.get("/pizzas/analytics", getPizzaAnalytics);
router.get("/revenue/report", getRevenueReport);

// Users Management
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Orders Management
router.get("/orders/recent", getRecentOrders);
router.get("/orders/search", searchOrders);
router.get("/orders/:id", getOrderDetails);

export default router;
