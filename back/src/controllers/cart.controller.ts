import { Request, Response } from "express";
import { Cart, ICart } from "../models/cart.model";
import { Product } from "../models/product.model";

// ✅ Function to calculate the total cost of the cart
const calculateTotal = async (cart: ICart): Promise<number> => {
  let total = 0;

  for (const item of cart.products) {
    const product = await Product.findById(item.productId);
    if (product && product.price) {
      total += product.price * item.quantity;
    }
  }

  return total;
};

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

    cart.total = await calculateTotal(cart);
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

    cart.total = await calculateTotal(cart);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du produit", error });
  }
};
