import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = express.Router();
router.post("/", authenticateJWT, addToWishlist);
router.delete("/", authenticateJWT, removeFromWishlist);

export default router;
