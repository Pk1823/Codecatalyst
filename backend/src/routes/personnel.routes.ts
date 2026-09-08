import { Router } from "express";
import { PersonnelController } from "../controllers/personnel.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, PersonnelController.getPersonnel);
router.get("/:id", authenticate, PersonnelController.getPersonnelById);

export default router;
