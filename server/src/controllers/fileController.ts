import { Request, Response } from "express";
import multer from "multer";
import prisma from "../prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";

// Allowed file extensions and max file size
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Multer instance with file filter and size limit
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.slice(file.originalname.lastIndexOf("."));
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
}).single("file");

// File upload controller
export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Upload file request received");
  try {
    // Check for token in the header
    const received = req.headers.authorization;
    const tokenParts = received?.split(" ");
    if (!tokenParts || tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const token = tokenParts[1];

    // Validate token and find user
    const user = await prisma.user.findUnique({ where: { secretKey: token } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        res.status(400).json({ error: err.message || "File upload failed" });
        return;
      }

      // Check if a file was provided
      if (!req.file) {
        res.status(400).json({ error: "File is required" });
        return;
      }

      // Save file details to the database
      const filePath = `/uploads/${req.file.filename}`;
      await prisma.file.create({
        data: {
          fileName: req.file.originalname,
          filePath,
          fileUrl: `${req.protocol}://${req.get("host")}${filePath}`,
          userId: user.id,
        },
      });

      // Respond with file details
      res.json({
        message: "File uploaded successfully",
        filePath,
        fileUrl: `${req.protocol}://${req.get("host")}${filePath}`,
      });
    });
  } catch (error) {
    console.error("Upload file error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check for token in cookies
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Decode token and find user
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

    const { id } = req.params;
    const file = await prisma.file.findUnique({ where: { id: Number(id) } });
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    if (file.userId !== user.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    // Delete file from the database and the filesystem
    await prisma.file.delete({ where: { id: Number(id) } });

    const filePath = `uploads/${file.fileName}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Respond with success message
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for token in cookies
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Decode token and find user
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

    // Fetch user files
    const files = await prisma.file.findMany({
      where: { userId: user.id },
      select: { id: true, fileName: true, fileUrl: true },
    });

    res.json(files);
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
