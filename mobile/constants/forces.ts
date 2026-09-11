export type ForceId = "CRPF" | "ARMY" | "BSF" | "ITBP" | "CISF" | "POLICE";

export interface ForceConfig {
  id: ForceId;
  name: string;
  hindiName: string;
  motto: string;
  hindiMotto: string;
  primaryColor: string;
  badgeAccent: string;
  unitHierarchyName: string;
  theatreDescription: string;
}

export const FORCES_CONFIG: Record<ForceId, ForceConfig> = {
  CRPF: {
    id: "CRPF",
    name: "Central Reserve Police Force",
    hindiName: "केंद्रीय रिजर्व पुलिस बल",
    motto: "Service and Loyalty",
    hindiMotto: "सेवा और निष्ठा",
    primaryColor: "#DC2626",
    badgeAccent: "#991B1B",
    unitHierarchyName: "Battalion / Company",
    theatreDescription: "Counter-Insurgency & Internal Security Grids",
  },
  ARMY: {
    id: "ARMY",
    name: "Indian Army",
    hindiName: "भारतीय थलसेना",
    motto: "Service Before Self",
    hindiMotto: "सेवा परमो धर्मः",
    primaryColor: "#15803D",
    badgeAccent: "#166534",
    unitHierarchyName: "Regiment / Battalion",
    theatreDescription: "High-Altitude Forward Defense (Siachen / Ladakh)",
  },
  BSF: {
    id: "BSF",
    name: "Border Security Force",
    hindiName: "सीमा सुरक्षा बल",
    motto: "Duty Unto Death",
    hindiMotto: "जीवन पर्यन्त कर्तव्य",
    primaryColor: "#D97706",
    badgeAccent: "#B45309",
    unitHierarchyName: "Frontier / Battalion / BOP",
    theatreDescription: "International Border Outpost Grids",
  },
  ITBP: {
    id: "ITBP",
    name: "Indo-Tibetan Border Police",
    hindiName: "भारत-तिब्बत सीमा पुलिस",
    motto: "Valour - Steadfastness - Commitment",
    hindiMotto: "शौर्य - दृढ़ता - कर्म निष्ठा",
    primaryColor: "#0284C7",
    badgeAccent: "#0369A1",
    unitHierarchyName: "Sector / Unit / Post",
    theatreDescription: "Himalayan High-Altitude Sub-Zero Border Posts",
  },
  CISF: {
    id: "CISF",
    name: "Central Industrial Security Force",
    hindiName: "केंद्रीय औद्योगिक सुरक्षा बल",
    motto: "Protection and Security",
    hindiMotto: "संरक्षण एवं सुरक्षा",
    primaryColor: "#4F46E5",
    badgeAccent: "#3730A3",
    unitHierarchyName: "Airport / Unit / Plant Grid",
    theatreDescription: "Critical Infrastructure & Aerospace Security",
  },
  POLICE: {
    id: "POLICE",
    name: "State Police Forces",
    hindiName: "राज्य पुलिस बल",
    motto: "Protection of Good, Restraint of Evil",
    hindiMotto: "सद्रक्षणाय खलनिग्रहणाय",
    primaryColor: "#475569",
    badgeAccent: "#334155",
    unitHierarchyName: "District / Police Station / PCR",
    theatreDescription: "Law & Order, 14-Hour Bandobast & Traffic Operations",
  },
};
