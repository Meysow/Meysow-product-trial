import { Request, Response } from "express";
import { Cart } from "../models/cart.model";

// 🆕 [POST] Add a product to the cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId === productId
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout au panier", error });
  }
};

// 🔍 [GET] Getting the cart according to the user ID
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(404).json({ message: "Panier vide" });
      return;
    }

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du panier", error });
  }
};

// ❌ [DELETE] Delete item from the cart
export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Panier introuvable" });
      return;
    }

    cart.products = cart.products.filter((p) => p.productId !== productId);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du produit", error });
  }
};
