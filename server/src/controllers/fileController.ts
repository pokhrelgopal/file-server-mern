import { Request, Response } from "express";
import multer from "multer";
import prisma from "../prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".webm",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".csv",
];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

class FileUploadError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "FileUploadError";
  }
}

const fileFilter = (req: any, file: any, cb: any) => {
  const ext = file.originalname
    .slice(file.originalname.lastIndexOf("."))
    .toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    cb(
      new FileUploadError(
        `Invalid file type. Allowed types are: ${ALLOWED_EXTENSIONS.join(
          ", "
        )}`,
        "INVALID_FILE_TYPE"
      ),
      false
    );
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
}).single("file");

export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (
    !req.headers["content-type"] ||
    !req.headers["content-type"].includes("multipart/form-data")
  ) {
    res.status(400).json({
      error: "Invalid Content-Type",
      details: "Request must have Content-Type: multipart/form-data",
    });
    return;
  }

  try {
    const received = req.headers.authorization;
    const tokenParts = received?.split(" ");
    if (!tokenParts || tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      res.status(401).json({
        error: "Authentication failed",
        details: "Valid Bearer token is required",
      });
      return;
    }
    const token = tokenParts[1];

    const user = await prisma.user.findUnique({ where: { secretKey: token } });
    if (!user) {
      res.status(404).json({
        error: "Authentication failed",
        details: "User not found with provided token",
      });
      return;
    }

    upload(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);

        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case "LIMIT_FILE_SIZE":
              return res.status(400).json({
                error: "File too large",
                details: `Maximum file size allowed is ${
                  MAX_FILE_SIZE / (1024 * 1024)
                }MB`,
              });
            case "LIMIT_UNEXPECTED_FILE":
              return res.status(400).json({
                error: "Invalid upload",
                details: "File must be uploaded using 'file' field name",
              });
            default:
              return res.status(400).json({
                error: "Upload failed",
                details: err.message,
              });
          }
        }

        if (err instanceof FileUploadError) {
          return res.status(400).json({
            error: err.code,
            details: err.message,
          });
        }

        return res.status(400).json({
          error: "Upload failed",
          details:
            err.message || "An unexpected error occurred during file upload",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "Missing file",
          details:
            "No file was detected in the request. Please ensure you're sending a file with the key 'file' in the form-data.",
        });
      }

      try {
        const filePath = `/uploads/${req.file.filename}`;
        const fileSize = req.file.size;
        const randomFileName = `${Date.now()}-${req.file.originalname}`;
        await prisma.file.create({
          data: {
            actualName:
              req.file.originalname.length > 50
                ? req.file.originalname.slice(0, 50)
                : req.file.originalname,
            fileName: randomFileName,
            filePath,
            fileSize,
            fileUrl: `${req.protocol}://${req.get("host")}${filePath}`,
            userId: user.id,
          },
        });

        res.json({
          message: "File uploaded successfully",
          filePath,
          fileUrl: `${req.protocol}://${req.get("host")}${filePath}`,
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({
          error: "Database error",
          details: "Failed to save file information to database",
        });
      }
    });
  } catch (error) {
    console.error("Upload file error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: "An unexpected error occurred while processing your request",
    });
  }
};
export const deleteFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Decode token and find user
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
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
      select: {
        id: true,
        actualName: true,
        fileName: true,
        fileUrl: true,
        fileSize: true,
        createdAt: true,
      },
    });

    res.json(files);
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
