import { Router } from "express";
import { googleLogin, login, logout, me } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", authenticateToken, me);
router.post("/logout", authenticateToken, logout);

export default router;
