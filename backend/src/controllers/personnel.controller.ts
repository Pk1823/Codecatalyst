import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { PersonnelService } from "../services/personnel.service";

export class PersonnelController {
  /**
   * GET /api/personnel
   * Fetch personnel list with RBAC scoping
   */
  static async getPersonnel(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const session = req.user!;
      const personnel = await PersonnelService.getPersonnelList(session);
      res.json({ personnel });
    } catch {
      res.status(500).json({ error: "Failed to fetch personnel" });
    }
  }

  /**
   * GET /api/personnel/:id
   * Fetch comprehensive personnel profile with DPDP Act clinical masking for Commanders
   */
  static async getPersonnelById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const session = req.user!;
      const personnelId = req.params.id;

      const record = await PersonnelService.getPersonnelDetail(session, personnelId);

      if (!record) {
        res.status(404).json({ error: "Personnel record not found." });
        return;
      }

      res.json({ personnel: record });
    } catch (error: any) {
      if (error?.message === "FORBIDDEN") {
        res.status(403).json({
          error: "Forbidden: You are not authorized to view this personnel's private record.",
          code: "FORBIDDEN",
        });
        return;
      }
      res.status(500).json({ error: "Failed to fetch personnel detail" });
    }
  }
}
