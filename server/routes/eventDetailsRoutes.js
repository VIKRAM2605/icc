import { Router } from "express";
import { createEventDetails } from "../controllers/eventDetailsController.js";
import { uploadEventDetails } from "../middleware/uploadEventDetails.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, uploadEventDetails, createEventDetails);

export default router;
