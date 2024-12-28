import express, { Router } from "express";
import { uploadFile } from "../controllers/fileController";

const router: Router = express.Router();

router.post("/upload", uploadFile);

export default router;
