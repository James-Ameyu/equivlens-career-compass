export const COUNTRIES = ["Kenya", "Nigeria", "Syria", "Ukraine", "India", "Colombia"] as const;
export const QUAL_TYPES = ["TVET / Vocational Diploma", "Bachelor's Degree", "Incomplete University Credits", "Informal Apprenticeship"] as const;
export const FIELDS = ["Software Development", "Electrical & Solar Engineering", "Nursing & Healthcare Support", "Accounting & Finance", "Hospitality & Trades"] as const;
export const TARGETS = ["Kenya KNQA", "European EQF", "Canada WES/NOC", "UK ENIC", "UAE"] as const;
export const DOC_STATUS = ["Full Transcripts Available", "Partial Records Only", "Paper Records Lost / Unreachable Institution"] as const;

export type Inputs = {
  country: string; qualType: string; field: string; target: string; role: string; docStatus: string;
};

export const ROLE_SUGGESTIONS: Record<string, string[]> = {
  "Software Development": ["Junior Software Developer", "QA / Test Engineer", "Master's in Computer Science"],
  "Electrical & Solar Engineering": ["Junior Renewable Energy Technician", "Electrical Installer", "Solar PV Technician"],
  "Nursing & Healthcare Support": ["Healthcare Assistant", "Registered Nurse (Bridging)", "Community Health Worker"],
  "Accounting & Finance": ["Accounts Assistant", "Junior Financial Analyst", "Chartered Accountancy Pathway"],
  "Hospitality & Trades": ["Commis Chef", "Hotel Front Office Associate", "Skilled Trades Apprentice"],
};

const ORIGIN_FRAMEWORK: Record<string, string> = {
  Kenya: "KNQF", Nigeria: "NQF-NG", Syria: "Syrian MoHE", Ukraine: "NQF-UA", India: "NSQF", Colombia: "MNC",
};
const TARGET_LEVEL: Record<string, { name: string; short: string }> = {
  "Kenya KNQA": { name: "KNQF", short: "KNQF" },
  "European EQF": { name: "EQF", short: "EQF" },
  "Canada WES/NOC": { name: "NOC TEER", short: "TEER" },
  "UK ENIC": { name: "RQF", short: "RQF" },
  UAE: { name: "QFEmirates", short: "QFE" },
};

type FieldData = { core: string[]; gaps: string[]; regExam: Record<string, string> };
const FIELD_DATA: Record<string, FieldData> = {
  "Software Development": {
    core: ["Object-oriented programming (Java/Python)", "Data structures & algorithms", "Relational databases & SQL", "Web application development (HTML/JS/REST)", "Version control with Git"],
    gaps: ["Cloud deployment & DevOps fundamentals (2-week module)", "Local data-protection law (GDPR / PIPEDA) awareness"],
    regExam: { default: "Technical coding assessment (no license required)" },
  },
  "Electrical & Solar Engineering": {
    core: ["Electrical installation & wiring (low voltage)", "Solar PV system design & sizing", "Electrical circuit theory & measurement", "Health & safety in electrical works", "Inverter & battery storage maintenance"],
    gaps: ["Local wiring regulations (e.g. VDE 0100 / BS 7671)", "Grid-connection certification for PV systems"],
    regExam: { "European EQF": "VDE electrical safety exam (Elektrofachkraft)", "UK ENIC": "City & Guilds 2382 (18th Edition)", default: "Licensed electrician regulatory exam" },
  },
  "Nursing & Healthcare Support": {
    core: ["Patient assessment & vital signs", "Infection prevention & control", "Medication administration basics", "Basic life support (BLS)", "Clinical documentation"],
    gaps: ["Language proficiency for healthcare (B2 / OET)", "Local nursing council competency test (OSCE)"],
    regExam: { "UK ENIC": "NMC CBT + OSCE", "Canada WES/NOC": "NCLEX-RN / NNAS assessment", default: "Health-professions council licensing exam" },
  },
  "Accounting & Finance": {
    core: ["Financial accounting & bookkeeping", "Management accounting & costing", "Auditing principles", "Business law & ethics", "Spreadsheet financial modelling"],
    gaps: ["Local tax system & payroll module", "IFRS / local GAAP reconciliation"],
    regExam: { default: "Professional body entry exam (ACCA/CPA exemption review)" },
  },
  "Hospitality & Trades": {
    core: ["Food safety & hygiene (HACCP)", "Customer service & front office operations", "Kitchen / workshop operations", "Workplace health & safety", "Inventory & stock control"],
    gaps: ["Local food-hygiene certificate (Level 2)", "Workplace language & labor-law orientation"],
    regExam: { default: "Trade skills test / practical assessment" },
  },
};

const QUAL_BASE: Record<string, { origin: number; target: number; score: number; weeks: number; label: string; targetLabel: string }> = {
  "TVET / Vocational Diploma": { origin: 6, target: 5, score: 82, weeks: 4, label: "Diploma", targetLabel: "Associate Technician" },
  "Bachelor's Degree": { origin: 7, target: 6, score: 88, weeks: 3, label: "Bachelor's Degree", targetLabel: "Bachelor's / Professional" },
  "Incomplete University Credits": { origin: 5, target: 5, score: 61, weeks: 10, label: "Partial Credits (~2 yrs)", targetLabel: "Short-cycle / Credit Transfer" },
  "Informal Apprenticeship": { origin: 4, target: 4, score: 58, weeks: 8, label: "Recognition of Prior Learning", targetLabel: "Skilled Worker (RPL)" },
};

const COST: Record<string, [number, number, string]> = {
  "Kenya KNQA": [60, 180, "USD"], "European EQF": [180, 450, "EUR"], "Canada WES/NOC": [250, 600, "CAD"], "UK ENIC": [150, 420, "GBP"], UAE: [200, 500, "USD"],
};

export type AltProof = { id: string; title: string; desc: string; weight: number };
const ALT_PROOFS: AltProof[] = [
  { id: "uqp", title: "UNESCO Qualifications Passport / Background Paper", desc: "Structured interview-based assessment by credential evaluators documenting your education history.", weight: 30 },
  { id: "portfolio", title: "Technical Competency Assessment Portfolio", desc: "Practical test results, project photos, code repositories or work samples.", weight: 25 },
  { id: "supervisor", title: "Supervisor / Employer Attestation Letter", desc: "Signed letter confirming duties, duration and skill level from a former supervisor.", weight: 20 },
  { id: "syllabi", title: "Syllabi Reconstruction & Sworn Affidavit", desc: "Course list reconstructed from memory, public curricula and a notarised declaration.", weight: 15 },
  { id: "peer", title: "Peer / Classmate Corroboration Statements", desc: "Statements from classmates or lecturers who can confirm enrolment and completion.", weight: 10 },
];

export type Result = {
  inputs: Inputs; score: number; originLevel: string; targetLevel: string;
  core: string[]; gaps: string[]; regExam: string; weeks: number; costRange: string;
  altProofs: AltProof[]; needsAlt: boolean; scenario: string; verificationId: string; microGrant: string;
};

// Curated hand-tuned scenarios (keys: country|qualType|field|target)
const SCENARIOS: Record<string, Partial<Result> & { scenario: string }> = {
  "Kenya|TVET / Vocational Diploma|Electrical & Solar Engineering|European EQF": { scenario: "Kenyan TVET Electrical → EU Renewable Technician", score: 82, originLevel: "KNQF Level 6 Diploma", targetLevel: "EQF Level 5 / Associate Technician", weeks: 4 },
  "India|Bachelor's Degree|Software Development|Canada WES/NOC": { scenario: "Indian B.Tech CS → Canadian Software Developer", score: 91, originLevel: "NSQF Level 7 Bachelor's (4-yr)", targetLevel: "Canadian Bachelor's / NOC 21232 (TEER 1)", weeks: 2 },
  "Nigeria|Bachelor's Degree|Nursing & Healthcare Support|UK ENIC": { scenario: "Nigerian BNSc → UK Registered Nurse", score: 78, originLevel: "NQF-NG Level 6 BNSc", targetLevel: "RQF Level 6 / NMC Registration (post-OSCE)", weeks: 12 },
  "Syria|Incomplete University Credits|Software Development|European EQF": { scenario: "Syrian partial CS degree → EU Junior Developer", score: 64, originLevel: "Syrian MoHE — 2 of 4 years completed", targetLevel: "EQF Level 5 Short-cycle / Credit Transfer", weeks: 10 },
  "Ukraine|Bachelor's Degree|Accounting & Finance|European EQF": { scenario: "Ukrainian Bachelor in Finance → EU Accounts Assistant", score: 86, originLevel: "NQF-UA Level 6 Bachelor's", targetLevel: "EQF Level 6 Bachelor's", weeks: 3 },
  "Colombia|Informal Apprenticeship|Hospitality & Trades|Canada WES/NOC": { scenario: "Colombian informal kitchen apprenticeship → Canadian Cook", score: 59, originLevel: "MNC — Non-formal (RPL eligible)", targetLevel: "NOC 63200 Cook (TEER 3) via Red Seal path", weeks: 8 },
  "Kenya|TVET / Vocational Diploma|Nursing & Healthcare Support|UAE": { scenario: "Kenyan Diploma in Clinical Medicine → UAE Healthcare Support", score: 74, originLevel: "KNQF Level 6 Diploma (Clinical Medicine)", targetLevel: "QFEmirates Level 5 / DHA Allied Health", weeks: 6 },
};

function hash(s: string) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

export function analyze(inputs: Inputs): Result {
  const fd = FIELD_DATA[inputs.field] ?? FIELD_DATA["Software Development"]!;
  const qb = QUAL_BASE[inputs.qualType] ?? QUAL_BASE["TVET / Vocational Diploma"]!;
  const tl = TARGET_LEVEL[inputs.target] ?? TARGET_LEVEL["European EQF"]!;
  const key = `${inputs.country}|${inputs.qualType}|${inputs.field}|${inputs.target}`;
  const sc = SCENARIOS[key];
  const h = hash(key);
  const docPenalty = inputs.docStatus === DOC_STATUS[0] ? 0 : inputs.docStatus === DOC_STATUS[1] ? 4 : 8;
  const baseScore = sc?.score ?? Math.min(95, Math.max(45, qb.score + ((h % 9) - 4)));
  const score = Math.max(40, baseScore - docPenalty);
  const coreCount = score >= 80 ? 5 : 4;
  const gaps = score < 65 ? [...fd.gaps, "Supervised work placement / practical assessment (4 weeks)"].slice(0, 2) : fd.gaps.slice(0, score >= 88 ? 1 : 2);
  const [lo, hi, cur] = COST[inputs.target] ?? COST["European EQF"]!;
  const weeks = (sc?.weeks ?? qb.weeks) + (docPenalty ? 2 : 0);
  const needsAlt = inputs.docStatus !== DOC_STATUS[0];
  const targetNum = inputs.target === "Canada WES/NOC" ? Math.max(1, 8 - qb.target) : qb.target;
  return {
    inputs, score,
    scenario: sc?.scenario ?? `${inputs.country} ${inputs.qualType} → ${inputs.role || inputs.field}`,
    originLevel: sc?.originLevel ?? `${ORIGIN_FRAMEWORK[inputs.country] ?? "National"} Level ${qb.origin} ${qb.label}`,
    targetLevel: sc?.targetLevel ?? `${tl.short} Level ${targetNum} / ${qb.targetLabel}`,
    core: fd.core.slice(0, coreCount), gaps,
    regExam: fd.regExam[inputs.target] ?? fd.regExam["default"]!,
    weeks, costRange: `${cur} ${lo}–${hi}`,
    altProofs: inputs.docStatus === DOC_STATUS[2] ? ALT_PROOFS : ALT_PROOFS.slice(1, 4),
    needsAlt,
    microGrant: score >= 75 ? "Eligible: PLP / partner micro-grant covers up to 70% of assessment fees" : "Eligible: Refugee & displaced learner bridging fund (full fee waiver possible)",
    verificationId: `EQL-${(h % 9000 + 1000)}-${inputs.country.slice(0, 2).toUpperCase()}${inputs.target.slice(0, 2).toUpperCase()}-${new Date().getFullYear()}`,
  };
}

export const DEMO_PROFILE: Inputs & { name: string } = {
  name: "Amina", country: "Kenya", qualType: "TVET / Vocational Diploma", field: "Electrical & Solar Engineering",
  target: "European EQF", role: "Junior Renewable Energy Technician (Germany)", docStatus: "Partial Records Only",
};

export type DirEntry = { id: number; qualification: string; inputs: Inputs };
export const DIRECTORY: DirEntry[] = [
  { id: 1, qualification: "BSc Computer Science", inputs: { country: "India", qualType: "Bachelor's Degree", field: "Software Development", target: "Canada WES/NOC", role: "Junior Software Developer", docStatus: DOC_STATUS[0] } },
  { id: 2, qualification: "TVET Electrical Installation", inputs: { country: "Kenya", qualType: "TVET / Vocational Diploma", field: "Electrical & Solar Engineering", target: "European EQF", role: "Junior Renewable Energy Technician", docStatus: DOC_STATUS[1] } },
  { id: 3, qualification: "Diploma in Clinical Medicine", inputs: { country: "Kenya", qualType: "TVET / Vocational Diploma", field: "Nursing & Healthcare Support", target: "UAE", role: "Healthcare Assistant", docStatus: DOC_STATUS[0] } },
  { id: 4, qualification: "Coding Bootcamp Certificate", inputs: { country: "Nigeria", qualType: "Informal Apprenticeship", field: "Software Development", target: "UK ENIC", role: "QA / Test Engineer", docStatus: DOC_STATUS[0] } },
  { id: 5, qualification: "Bachelor of Nursing Science", inputs: { country: "Nigeria", qualType: "Bachelor's Degree", field: "Nursing & Healthcare Support", target: "UK ENIC", role: "Registered Nurse (Bridging)", docStatus: DOC_STATUS[1] } },
  { id: 6, qualification: "Partial BSc Informatics (2 yrs)", inputs: { country: "Syria", qualType: "Incomplete University Credits", field: "Software Development", target: "European EQF", role: "Junior Software Developer", docStatus: DOC_STATUS[2] } },
  { id: 7, qualification: "Bachelor in Finance & Credit", inputs: { country: "Ukraine", qualType: "Bachelor's Degree", field: "Accounting & Finance", target: "European EQF", role: "Accounts Assistant", docStatus: DOC_STATUS[1] } },
  { id: 8, qualification: "Informal Kitchen Apprenticeship", inputs: { country: "Colombia", qualType: "Informal Apprenticeship", field: "Hospitality & Trades", target: "Canada WES/NOC", role: "Commis Chef", docStatus: DOC_STATUS[2] } },
];

export const TOOLKIT = [
  { id: "affidavit", title: "Sworn Affidavit & Syllabus Reconstruction", summary: "Declare your studies under oath and rebuild your course list from public curricula, old timetables and memory.", steps: ["List every course, year and grade you remember", "Download the institution's published curriculum", "Sign a notarised declaration before a commissioner of oaths"], template: `SWORN AFFIDAVIT OF EDUCATIONAL HISTORY\n\nI, [Full Name], born [Date of Birth], of [Address], do solemnly declare that:\n\n1. I was enrolled at [Institution Name], [City, Country] from [Month/Year] to [Month/Year] in the programme [Programme Title].\n2. I completed the following courses (reconstructed syllabus attached as Annex A): [Course list].\n3. My original records are unavailable because [reason, e.g. institution closed due to conflict].\n\nI make this declaration conscientiously believing it to be true.\n\nSworn at [Place] on [Date]\n______________________  Commissioner of Oaths` },
  { id: "assessment", title: "Practical Trade / Code Assessment", summary: "Prove skills directly through a supervised practical test, coding challenge or trade skills exam.", steps: ["Register with an accredited assessment centre", "Complete a supervised practical task", "Receive a competency statement mapped to the target framework"], template: `COMPETENCY ASSESSMENT REPORT\n\nCandidate: [Full Name]     Assessment ID: [ID]\nOccupation: [e.g. Solar PV Installer]\nFramework reference: [e.g. EQF Level 5]\n\nTasks assessed:\n  [✓] Task 1 — [e.g. Size and install a 3kW grid-tied PV array]\n  [✓] Task 2 — [e.g. Safety isolation and testing]\n\nOutcome: COMPETENT / NOT YET COMPETENT\nAssessor: [Name, Registration No.]   Date: [Date]` },
  { id: "employer", title: "Employer / Supervisor Verification", summary: "A former supervisor confirms your role, duration and skills on letterhead or by signed statement.", steps: ["Contact a past supervisor or manager", "Share a template describing needed details", "Get it signed with contact details for verification"], template: `To Whom It May Concern,\n\nI confirm that [Full Name] worked under my direct supervision at [Company] from [Start Date] to [End Date] as a [Job Title].\n\nKey duties included:\n  • [Duty 1]\n  • [Duty 2]\n  • [Duty 3]\n\nI rate their technical competence as [level] and would gladly confirm these details at [phone / email].\n\nSincerely,\n[Name], [Position]\n[Signature]   [Date]` },
  { id: "passport", title: "Humanitarian Qualifications Passports", summary: "UNESCO Qualifications Passport and the European Qualifications Passport for Refugees assess undocumented qualifications.", steps: ["Apply through UNHCR / UNESCO partner or national ENIC-NARIC", "Attend a structured interview with credential evaluators", "Receive a passport document recognised by many institutions"], template: `UNESCO QUALIFICATIONS PASSPORT — BACKGROUND PAPER (extract)\n\nHolder: [Full Name]     Nationality: [Country]\nAssessment date: [Date]\n\nHighest qualification assessed: [e.g. Bachelor of Science in Computer Engineering]\nInstitution: [Name], [Country]\nComparable level: [e.g. Bachelor's — EQF Level 6]\n\nLanguage proficiency: [Languages & levels]\nWork experience: [Summary]\n\nThis document is an evaluation based on available documentation and a structured interview.\nIt is not a formal recognition decision.` },
];
