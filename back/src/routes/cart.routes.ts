import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authenticateJWT, addToCart);
router.get("/", authenticateJWT, getCart);
router.delete("/", authenticateJWT, removeFromCart);

export default router;
