import { Request, Response } from "express";
import prisma from "../prisma";
import { createMySecretKey, hashSecretKey } from "../utils/generator";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}
/**
 * Generates a new secret key for a user and stores the hashed version in the database.
 * @param req - Express Request object
 * @param res - Express Response object
 */

export const generateSecretKey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const userId = decoded.userId.toString();

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const secretKey = createMySecretKey();
    const hashedSecretKey = await hashSecretKey(secretKey);

    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { secretKey: hashedSecretKey },
    });

    res.json({ key: secretKey });
  } catch (error) {
    console.error("Generate secret key error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Rolls (regenerates) a user's secret key and updates the hashed version in the database.
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const rollSecretKey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const userId = decoded.userId.toString();
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const secretKey = createMySecretKey();
    const hashedSecretKey = await hashSecretKey(secretKey);

    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { secretKey: hashedSecretKey },
    });

    res.json({ message: "Secret key rolled successfully", status: 200 });
  } catch (error) {
    console.error("Roll secret key error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSecretKey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const userId = decoded.userId.toString();
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ secretKey: user.secretKey });
  } catch (error) {
    console.error("Get secret key error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
