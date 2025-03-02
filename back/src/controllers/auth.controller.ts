import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/user.model";

// 🔐 [POST] Create User (/account)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, firstname, email, password } = req.body;

    // Email verification
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Cet email est déjà utilisé." });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser: IUser = new User({
      username,
      firstname,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "Compte créé avec succès !" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création du compte", error });
  }
};

// 🔑 [POST] User connexion (/token)
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // User verification
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Email ou mot de passe incorrect." });
      return;
    }

    // Password verification
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Email ou mot de passe incorrect." });
      return;
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error });
  }
};
