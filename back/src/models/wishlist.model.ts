import mongoose, { Document, Schema } from "mongoose";

export interface IWishlist extends Document {
  userId: string;
  products: string[];
}

const WishlistSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    products: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);
