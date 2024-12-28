import express, { Router } from "express";
import {
  uploadFile,
  getFiles,
  deleteFile,
} from "../controllers/fileController";

const router: Router = express.Router();

router.post("/upload", uploadFile);
router.get("/", getFiles);
router.delete("/:id", deleteFile);

export default router;
