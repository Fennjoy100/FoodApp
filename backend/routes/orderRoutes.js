import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer routes
router.post("/", verifyToken, placeOrder);
router.get("/my", verifyToken, getMyOrders);
router.delete("/:id", verifyToken, cancelOrder);

// Admin routes
router.get("/admin/orders", verifyToken, isAdmin, getAllOrders);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);
router.get("/admin/stats", verifyToken, isAdmin, getOrderStats);

export default router;
