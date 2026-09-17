export type View =
  | "home"
  | "explorer"
  | "project-detail"
  | "reality-check"
  | "report"
  | "my-reports"
  | "report-tracking"
  | "ai-explainer"
  | "what-can-i-do"
  | "learn"
  | "about"
  | "profile";

export type Language = "en" | "fr" | "pt" | "ar" | "ha" | "yo" | "ig";

export type ProjectStatus = "on-track" | "delayed" | "completed" | "stalled" | "disputed";
export type PrivacyMode = "anonymous" | "protected" | "public";
export type ReportStatus = "submitted" | "under-review" | "verified" | "institution-response" | "resolved";

export interface Project {
  id: string;
  name: string;
  country: string;
  region: string;
  community: string;
  budget: string;
  currency: string;
  category: "healthcare" | "education" | "roads" | "water" | "electricity" | "other";
  status: ProjectStatus;
  institution: string;
  contractor: string;
  promisedDelivery: string;
  lastUpdated: string;
  description: string;
  officialDeliverables: string[];
  verificationStatus: "verified" | "unverified" | "disputed";
  discrepancyCount: number;
  communityReports: number;
  coordinates: { lat: number; lng: number };
}

export interface Report {
  id: string;
  trackingId: string;
  projectId: string;
  projectName: string;
  status: ReportStatus;
  privacy: PrivacyMode;
  submittedAt: string;
  lastUpdate: string;
  summary: string;
  hasNewUpdate: boolean;
}

export interface Language_Config {
  code: Language;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  flag: string;
}
