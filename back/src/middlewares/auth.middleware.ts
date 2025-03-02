import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Accès refusé, token manquant." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      email: string;
    };
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide." });
  }
};

// ✅ Middleware to check if the user is an admin
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if ((req as any).user.email !== "admin@admin.com") {
    res.status(403).json({ message: "Accès refusé : Admin requis." });
    return;
  }
  next();
};
