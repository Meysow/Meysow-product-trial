import mongoose, { Document, Schema } from "mongoose";

export interface ICart extends Document {
  userId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    total: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
