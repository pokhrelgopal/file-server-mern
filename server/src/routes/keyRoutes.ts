import express, { Router } from "express";
import authenticate from "../middlewares/authMiddleware";
import { generateSecretKey, rollSecretKey } from "../controllers/keyController";

const router: Router = express.Router();

router.post("/generate-secret-key", generateSecretKey);
router.post("/roll-secret-key", rollSecretKey);

export default router;
