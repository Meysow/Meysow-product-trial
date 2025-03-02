import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import productRoutes from "./routes/product.routes";

dotenv.config();

const app = express();

// 🛠️ Middleware
app.use(express.json());
app.use(cors());

// 🛠️ Routes
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined in the .env file");
}

// 🛠️ Database connexion
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions) // Type assertion to specify the type of options
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

app.get("/", (_req, res) => {
  res.send("🚀 API en ligne !");
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(PORT, () => console.log(`🔥 Serveur démarré sur le port ${PORT}`));
