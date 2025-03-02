import express from "express";
import { login, register } from "../controllers/auth.controller";

const router = express.Router();

// Auth Routes
router.post("/account", register);
router.post("/token", login);

export default router;
