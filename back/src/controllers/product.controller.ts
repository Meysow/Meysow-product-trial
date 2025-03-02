import { Request, Response } from "express";
import { IProduct, Product } from "../models/product.model";

// 🆕 [POST] Créer un produit
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newProduct: IProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct); // ✅ On appelle res.json(), mais on ne le retourne pas
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création du produit", error });
  }
};

// 🔎 [GET] Récupérer tous les produits
export const getProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des produits", error });
  }
};

// 🔍 [GET] Récupérer un produit par ID
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du produit", error });
  }
};

// ✏️ [PATCH] Mettre à jour un produit
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du produit", error });
  }
};

// ❌ [DELETE] Supprimer un produit
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du produit", error });
  }
};
