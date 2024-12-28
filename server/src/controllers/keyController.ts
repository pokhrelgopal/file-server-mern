import { Request, Response } from "express";
import prisma from "../prisma";
import { createMySecretKey, hashSecretKey } from "../utils/generator";

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
    const { email }: { email: string } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const secretKey = createMySecretKey();
    const hashedSecretKey = await hashSecretKey(secretKey);

    await prisma.user.update({
      where: { email },
      data: { secretKey: hashedSecretKey },
    });

    res.json({ message: "Secret key generated successfully" });
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
    const { email }: { email: string } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const secretKey = createMySecretKey();
    const hashedSecretKey = await hashSecretKey(secretKey);

    await prisma.user.update({
      where: { email },
      data: { secretKey: hashedSecretKey },
    });

    res.json({ message: "Secret key rolled successfully" });
  } catch (error) {
    console.error("Roll secret key error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
