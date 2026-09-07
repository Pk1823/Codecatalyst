import { ForceType } from "@/components/providers";

export interface ForceMetadata {
  id: ForceType;
  name: string;
  nameHi: string;
  shortName: string;
  parentMinistry: string;
  parentMinistryHi: string;
  motto: string;
  mottoHi: string;
  primaryTheatre: string;
  sampleUnit: string;
  sampleBattalion: string;
  sampleLocation: string;
  helpline: string;
  helplineName: string;
  badgeAccent: string;
  badgeBg: string;
  ranks: {
    personnel: string;
    personnelHi: string;
    welfare: string;
    welfareHi: string;
    commander: string;
    commanderHi: string;
  };
  samplePersonnelName: string;
  sampleOfficerName: string;
  sampleCommanderName: string;
  sampleServiceId: string;
}

export const FORCES_METADATA: Record<ForceType, ForceMetadata> = {
  CRPF: {
    id: "CRPF",
    name: "Central Reserve Police Force",
    nameHi: "केन्द्रीय रिजर्व पुलिस बल",
    shortName: "CRPF",
    parentMinistry: "Ministry of Home Affairs (Police II Division)",
    parentMinistryHi: "गृह मंत्रालय (पुलिस II प्रभाग), भारत सरकार",
    motto: "Service and Loyalty",
    mottoHi: "सेवा और निष्ठा",
    primaryTheatre: "LWE Counter-Insurgency (Bastar / Sukma / Dantewada) & J&K",
    sampleUnit: "74th Battalion, Bravo Company",
    sampleBattalion: "74 Bn CRPF",
    sampleLocation: "Forward Operating Base, Dantewada",
    helpline: "14416 / 1800-599-0019",
    helplineName: "CRPF Tele-MANAS & 'Madadgar' Welfare Line",
    badgeAccent: "text-red-400 border-red-500/40 bg-red-950/30",
    badgeBg: "from-red-900 via-slate-900 to-slate-950",
    ranks: {
      personnel: "Constable (General Duty)",
      personnelHi: "कांस्टेबल (सामान्य ड्यूटी)",
      welfare: "Deputy Commandant (Medical / Welfare)",
      welfareHi: "उप समादेष्टा (चिकित्सा / कल्याण)",
      commander: "Commandant (Commanding Officer)",
      commanderHi: "समादेष्टा / बटालियन कमान अधिकारी",
    },
    samplePersonnelName: "Ct. Piyush Kumar",
    sampleOfficerName: "Dr. Aarti Sharma",
    sampleCommanderName: "Col. Rajeshwar Singh (Retd) / Shri R. Singh",
    sampleServiceId: "CRPF-GD-2021-04128",
  },
  ARMY: {
    id: "ARMY",
    name: "Indian Army",
    nameHi: "भारतीय थल सेना",
    shortName: "Indian Army",
    parentMinistry: "Ministry of Defence (Department of Military Affairs)",
    parentMinistryHi: "रक्षा मंत्रालय (सैन्य कार्य विभाग), भारत सरकार",
    motto: "Service Before Self",
    mottoHi: "सेवा परमो धर्मः",
    primaryTheatre: "High Altitude Warfare (Siachen / Eastern Ladakh / LoC)",
    sampleUnit: "16 Rajputana Rifles, Alpha Company",
    sampleBattalion: "16 RAJ RIF / 14 Corps",
    sampleLocation: "Forward Defended Post, Sub-Sector North (Leh)",
    helpline: "14416 / 1904",
    helplineName: "Army Helpline & AWWA Family Support",
    badgeAccent: "text-emerald-400 border-emerald-500/40 bg-emerald-950/30",
    badgeBg: "from-emerald-950 via-slate-900 to-slate-950",
    ranks: {
      personnel: "Sepoy / Rifleman",
      personnelHi: "सिपाही / राइफलमैन",
      welfare: "Regimental Medical Officer (Major, AMC)",
      welfareHi: "रेजिमेंटल मेडिकल ऑफिसर (मेजर, एएमसी)",
      commander: "Colonel (Commanding Officer)",
      commanderHi: "कर्नल / कमान अधिकारी",
    },
    samplePersonnelName: "Rfn. Vikram Batra / Sep. Amit Thapa",
    sampleOfficerName: "Maj. (Dr.) Aarti Sharma, AMC",
    sampleCommanderName: "Col. Rajeshwar Singh, SM",
    sampleServiceId: "15482931X-ARMY",
  },
  BSF: {
    id: "BSF",
    name: "Border Security Force",
    nameHi: "सीमा सुरक्षा बल",
    shortName: "BSF",
    parentMinistry: "Ministry of Home Affairs",
    parentMinistryHi: "गृह मंत्रालय, भारत सरकार",
    motto: "Duty Unto Death",
    mottoHi: "जीवन पर्यन्त कर्तव्य",
    primaryTheatre: "International Border (Punjab Outposts / Thar Desert / Rann of Kutch)",
    sampleUnit: "182nd Battalion, BOP Ranian",
    sampleBattalion: "182 Bn BSF",
    sampleLocation: "Border Outpost Ranian, Sector Amritsar",
    helpline: "14416 / 1800-11-0026",
    helplineName: "BSF 'Seema Prahari' 24x7 Helpline",
    badgeAccent: "text-amber-400 border-amber-500/40 bg-amber-950/30",
    badgeBg: "from-amber-950 via-slate-900 to-slate-950",
    ranks: {
      personnel: "Constable (GD)",
      personnelHi: "कांस्टेबल (सीमा सुरक्षा)",
      welfare: "Chief Medical Officer (SAG)",
      welfareHi: "मुख्य चिकित्सा अधिकारी (कल्याण)",
      commander: "Commandant",
      commanderHi: "समादेष्टा / सेक्टर कमांड",
    },
    samplePersonnelName: "Ct. Gurpreet Singh",
    sampleOfficerName: "Dr. Sunita Rao",
    sampleCommanderName: "Commandant Ajay Verma",
    sampleServiceId: "BSF-08149201",
  },
  ITBP: {
    id: "ITBP",
    name: "Indo-Tibetan Border Police",
    nameHi: "भारत-तिब्बत सीमा पुलिस",
    shortName: "ITBP",
    parentMinistry: "Ministry of Home Affairs",
    parentMinistryHi: "गृह मंत्रालय, भारत सरकार",
    motto: "Valour - Steadfastness - Commitment",
    mottoHi: "शौर्य - दृढ़ता - कर्म निष्ठा",
    primaryTheatre: "Extreme Altitude Snow Line (-35°C Indo-China Border Passes)",
    sampleUnit: "1st Battalion, Mountain Post Mana",
    sampleBattalion: "1st Bn ITBP",
    sampleLocation: "High Altitude Post Mana Pass (17,890 ft)",
    helpline: "14416 / 011-24368243",
    helplineName: "ITBP 'Himveer' Wellness Cell",
    badgeAccent: "text-cyan-400 border-cyan-500/40 bg-cyan-950/30",
    badgeBg: "from-cyan-950 via-slate-900 to-slate-950",
    ranks: {
      personnel: "Himveer Constable (GD)",
      personnelHi: "हिमवीर कांस्टेबल (सामान्य ड्यूटी)",
      welfare: "Senior Medical Officer",
      welfareHi: "वरिष्ठ चिकित्सा अधिकारी",
      commander: "Commandant",
      commanderHi: "समादेष्टा",
    },
    samplePersonnelName: "Ct. Tsering Dorje",
    sampleOfficerName: "Dr. Aarti Sharma",
    sampleCommanderName: "Commandant K. S. Rawat",
    sampleServiceId: "ITBP-HV-94102",
  },
  CISF: {
    id: "CISF",
    name: "Central Industrial Security Force",
    nameHi: "केन्द्रीय औद्योगिक सुरक्षा बल",
    shortName: "CISF",
    parentMinistry: "Ministry of Home Affairs",
    parentMinistryHi: "गृह मंत्रालय, भारत सरकार",
    motto: "Protection and Security",
    mottoHi: "संरक्षण एवं सुरक्षा",
    primaryTheatre: "Critical National Infrastructure, Nuclear Installations & Airports",
    sampleUnit: "Airport Security Group (ASG), Terminal 3",
    sampleBattalion: "CISF ASG Unit",
    sampleLocation: "IGI Airport & Strategic Asset Zone",
    helpline: "14416 / 1800-111-363",
    helplineName: "CISF 'Sanrakshak' Welfare Desk",
    badgeAccent: "text-blue-400 border-blue-500/40 bg-blue-950/30",
    badgeBg: "from-blue-950 via-slate-900 to-slate-950",
    ranks: {
      personnel: "Constable (Security & Screening)",
      personnelHi: "कांस्टेबल (सुरक्षा एवं स्क्रीनिंग)",
      welfare: "Assistant Commandant (Welfare)",
      welfareHi: "सहायक समादेष्टा (कल्याण)",
      commander: "Senior Commandant",
      commanderHi: "वरिष्ठ समादेष्टा",
    },
    samplePersonnelName: "Ct. Sandeep Sharma",
    sampleOfficerName: "Dr. Aarti Sharma",
    sampleCommanderName: "Sr. Commandant M. V. Rao",
    sampleServiceId: "CISF-SEC-72019",
  },
  STATE_POLICE: {
    id: "STATE_POLICE",
    name: "State Police Services",
    nameHi: "राज्य पुलिस बल",
    shortName: "Police",
    parentMinistry: "Home Department, State Government",
    parentMinistryHi: "गृह विभाग, राज्य शासन",
    motto: "To Protect the Good, Subdue the Evil",
    mottoHi: "सद्रक्षणाय खलनिग्रहणाय",
    primaryTheatre: "Urban Law & Order, 14-Hour Bandobast, PCR Patrol & Investigations",
    sampleUnit: "Central Police District, PCR Squad 14",
    sampleBattalion: "District Reserve Police Lines",
    sampleLocation: "City Police Lines / Police Station Central",
    helpline: "112 / 14416 / 1800-599-0019",
    helplineName: "State Police 'Kutumb' Mental Health Cell",
    badgeAccent: "text-indigo-400 border-indigo-500/40 bg-indigo-950/30",
    badgeBg: "from-indigo-950 via-slate-900 to-slate-950",
    ranks: {
      personnel: "Police Constable / Head Constable",
      personnelHi: "पुलिस आरक्षक / मुख्य आरक्षक",
      welfare: "Police Surgeon / Welfare Inspector",
      welfareHi: "पुलिस शल्य चिकित्सक / कल्याण निरीक्षक",
      commander: "Superintendent of Police (SP) / DCP",
      commanderHi: "पुलिस अधीक्षक (एसपी) / पुलिस उपायुक्त",
    },
    samplePersonnelName: "Ct. Arvind Jadhav",
    sampleOfficerName: "Insp. (Dr.) Meera Kulkarni",
    sampleCommanderName: "Shri Rajeshwar Singh, IPS",
    sampleServiceId: "POL-MH-2018-9104",
  },
};
