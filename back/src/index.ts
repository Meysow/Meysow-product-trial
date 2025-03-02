import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import productRoutes from "./routes/product.routes";
import wishlistRoutes from "./routes/wishlist.routes";

dotenv.config();

export const app = express();

// 🛠️ Middleware
app.use(express.json());
app.use(cors());

// 🛠️ Routes
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);

// 🏠 Check if server in working
app.get("/", (_req, res) => {
  res.send("🚀 API en ligne !");
});

// 🛠️ MongoDB Connexion
const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined in the .env file");
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// 🚀 Start server **Don't start it when testing**
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  app.listen(PORT, () => console.log(`🔥 Serveur démarré sur le port ${PORT}`));
}
