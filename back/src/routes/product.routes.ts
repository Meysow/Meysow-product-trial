import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = express.Router();

// CRUD Routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticateJWT, createProduct);
router.patch("/:id", authenticateJWT, updateProduct);
router.delete("/:id", authenticateJWT, deleteProduct);

export default router;
