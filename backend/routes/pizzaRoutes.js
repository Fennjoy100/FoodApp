import express from "express";
import {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
  toggleAvailability,
} from "../controllers/pizzaController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPizzas);
router.get("/:id", getPizzaById);

// Admin routes
router.post("/", verifyToken, isAdmin, createPizza);
router.put("/:id", verifyToken, isAdmin, updatePizza);
router.delete("/:id", verifyToken, isAdmin, deletePizza);
router.patch("/:id/availability", verifyToken, isAdmin, toggleAvailability);

export default router;
