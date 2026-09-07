import { User } from "@/types/auth";

export const MOCK_USERS: Record<string, User> = {
  personnel: {
    id: "user-p-1024",
    name: "Ct. Piyush Kumar",
    email: "piyush.k@crpf.gov.in",
    role: "PERSONNEL",
    rank: "Constable (GD)",
    unit: "74th Bn, Bravo Coy",
    personnelId: "P-1024",
    department: "Security & Operations",
  },
  welfare: {
    id: "user-welfare-01",
    name: "Dr. Aarti Sharma",
    email: "aarti.sharma@welfare.gov.in",
    role: "WELFARE_OFFICER",
    rank: "Deputy Commandant (Medical/Welfare)",
    unit: "Force HQ Welfare Directorate",
    department: "Personnel Welfare & Psychological Support",
  },
  commander: {
    id: "user-cmd-01",
    name: "Col. Rajeshwar Singh",
    email: "r.singh@crpf.gov.in",
    role: "COMMANDER",
    rank: "Commandant / Sector Commander",
    unit: "Sector HQ Special Ops",
    department: "Command Operations & Force Readiness",
  },
  admin: {
    id: "user-admin-01",
    name: "Sunil Patel",
    email: "admin.mw@nic.in",
    role: "ADMIN",
    rank: "Senior Systems Officer",
    unit: "National Informatics & Security Division",
    department: "IT & Audit Security Cell",
  },
};
