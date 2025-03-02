import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { authenticateJWT, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

// CRUD Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// CRUD Routes protected (Admin)
router.post("/", authenticateJWT, isAdmin, createProduct);
router.patch("/:id", authenticateJWT, isAdmin, updateProduct);
router.delete("/:id", authenticateJWT, isAdmin, deleteProduct);

export default router;
