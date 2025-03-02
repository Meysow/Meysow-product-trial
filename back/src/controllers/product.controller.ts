import { Request, Response } from "express";
import { IProduct, Product } from "../models/product.model";

// 🆕 [POST] Create a product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newProduct: IProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création du produit", error });
  }
};

// 🔎 [GET] Getting All the products
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

// 🔍 [GET] Getting a product according to its ID
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

// ✏️ [PATCH] Update a product
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

// ❌ [DELETE] Delete a product
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
