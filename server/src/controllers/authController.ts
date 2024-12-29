import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import prisma from "../prisma";
import {
  createMySecretKey,
  hashSecretKey,
  otpGenerator,
} from "../utils/generator";

// Define types for JWT payload
interface JwtPayload {
  userId: string;
}

// Login Function
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: "User does not exist." });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Incorrect Password" });
      return;
    }

    if (!user.isVerified) {
      res.status(401).json({ error: "User is not verified", status: 401 });
      const otp = otpGenerator();
      await prisma.user.update({
        where: { email },
        data: { otp },
      });
      if (process.env.NODE_ENV === "production") {
        // Send OTP to user's email
      } else {
        console.log(" Please check your email for OTP: ", otp);
      }
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 604800000),
      domain: "localhost",
    });
    res.json({
      message: "Login successful",
      status: 200,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    let token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const userId = decoded.userId.toString();

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      select: { id: true, email: true, fullName: true },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Signup Function
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = otpGenerator();
    const secretKey = createMySecretKey();
    const hashedSecretKey = await hashSecretKey(secretKey);

    console.log(" Please check your email for OTP: ", otp);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        otp,
        secretKey: hashedSecretKey,
      },
    });

    if (user && process.env.NODE_ENV === "production") {
      // Send OTP to user's email
    }

    res.status(201).json({ message: "User created successfully", status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Validate OTP Function
export const validateOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp }: { email: string; otp: string } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    await prisma.user.update({
      where: { email },
      data: { otp: null, isVerified: true },
    });
    console.log("OTP validated successfully");
    res.json({ message: "OTP validated successfully", status: 200 });
  } catch (error) {
    console.error("Validate OTP error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout Function
export const logout = (req: Request, res: Response): void => {
  const token = req.cookies?.token;
  console.log("Token: ", token);
  res.clearCookie("token");
  res.json({ message: "Logged out successfully", status: 200 });
};
