import mongoose, { Document, Schema } from "mongoose";

// Définition de l'interface TypeScript pour un produit
export interface IProduct extends Document {
  code: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  quantity: number;
  internalReference: string;
  shellId: number;
  inventoryStatus: "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma Mongoose
const ProductSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    internalReference: { type: String, unique: true },
    shellId: { type: Number },
    inventoryStatus: {
      type: String,
      enum: ["INSTOCK", "LOWSTOCK", "OUTOFSTOCK"],
      required: true,
    },
    rating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
