import { Router, Response } from "express";
import { authenticate, AuthenticatedRequest, canAccessPersonnel } from "../middleware/auth.middleware";
import { prisma } from "../lib/db";

const router = Router();

router.get("/", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const session = req.user!;

    if (session.role === "PERSONNEL") {
      if (!session.personnelId) {
        res.json({ personnel: [] });
        return;
      }
      const record = await prisma.personnel.findUnique({
        where: { id: session.personnelId },
        include: { unit: true, riskPredictions: { orderBy: { createdAt: "desc" }, take: 1 } },
      });
      res.json({ personnel: record ? [record] : [] });
      return;
    }

    const personnel = await prisma.personnel.findMany({
      include: {
        unit: true,
        riskPredictions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { name: "asc" },
    });

    res.json({ personnel });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch personnel" });
  }
});

router.get("/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const session = req.user!;
    const personnelId = req.params.id.toUpperCase();

    if (!canAccessPersonnel(session, personnelId)) {
      res.status(403).json({
        error: "Forbidden: You are not authorized to view this personnel's private record.",
        code: "FORBIDDEN",
      });
      return;
    }

    const isCommander = session.role === "COMMANDER";

    const record = await prisma.personnel.findUnique({
      where: { id: personnelId },
      include: {
        unit: true,
        deployments: { orderBy: { startDate: "desc" }, take: 5 },
        dutySchedules: { orderBy: { date: "desc" }, take: 7 },
        leaveRecords: { orderBy: { startDate: "desc" }, take: 5 },
        workloadRecords: { orderBy: { periodStart: "desc" }, take: 3 },
        riskPredictions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { factors: true, recommendations: true },
        },
        wellnessAssessments: isCommander
          ? false
          : {
              orderBy: { createdAt: "desc" },
              take: 5,
              include: { responses: true },
            },
        welfareCases: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: { caseNotes: !isCommander, supportActions: true },
        },
      },
    });

    if (!record) {
      res.status(404).json({ error: "Personnel record not found." });
      return;
    }

    res.json({ personnel: record });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch personnel detail" });
  }
});

export default router;
