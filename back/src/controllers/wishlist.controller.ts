import { Request, Response } from "express";
import { Wishlist } from "../models/wishlist.model";

// 🆕 [POST] Add a product to the wishlist
export const addToWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user.userId;
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, products: [] });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  res.status(200).json(wishlist);
};

// ❌ [DELETE] Delete item from the wishlist
export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      res.status(404).json({ message: "Liste d'envies introuvable" });
      return;
    }
    wishlist.products = wishlist.products.filter((id) => id !== productId);

    await wishlist.save();
    res.status(200).json({ message: "Produit supprimé de la liste d'envies", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du produit", error });
  }
};

