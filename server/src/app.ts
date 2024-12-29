import dotenv from "dotenv";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import keyRoutes from "./routes/keyRoutes";
import fileRoutes from "./routes/fileRoutes";
import prisma from "./prisma";
import path from "path";
import bodyParser from "body-parser";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"].filter(Boolean),
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/keys", keyRoutes);
app.use("/api/files", fileRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
    console.log("Prisma client disconnected successfully.");
  } catch (error) {
    console.error("Error disconnecting Prisma client:", error);
  } finally {
    process.exit(0);
  }
});
