import { Request, Response } from "express";
import { Wishlist } from "../models/wishlist.model";

// 🆕 [POST] Add a product to the wishlist
export const addToWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ message: "Le champ productId est obligatoire." });
      return;
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout à la wishlist", error });
  }
};

// ❌ [DELETE] Delete item from the wishlist
export const removeFromWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ message: "Le champ productId est obligatoire." });
      return;
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      res.status(404).json({ message: "Wishlist introuvable." });
      return;
    }

    wishlist.products = wishlist.products.filter((id) => id !== productId);

    await wishlist.save();
    res
      .status(200)
      .json({ message: "Produit supprimé de la wishlist", wishlist });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la wishlist", error });
  }
};
