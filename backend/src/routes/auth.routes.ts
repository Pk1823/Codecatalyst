import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", AuthController.login);
router.post("/signup", AuthController.register);
router.post("/register", AuthController.register);
router.get("/google/url", AuthController.getGoogleUrl);
router.get("/google/callback", AuthController.googleCallback);
router.post("/google/callback", AuthController.googleCallback);
router.post("/google", AuthController.googleAuth);
router.post("/logout", authenticate, AuthController.logout);
router.get("/session", authenticate, AuthController.getSession);

export default router;
