import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: { id: string };
}

const authenticate = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;
  console.log("Token received in authenticate middleware:", token);

  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        console.error("JWT verification error:", err);
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      req.user = { id: (decoded as { userId: string }).userId };
      console.log("Decoded token:", req.user);
      next();
    }
  );
};

export default authenticate;
