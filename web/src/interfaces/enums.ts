export enum UserTypes {
  CORE = "Core Team Member",
  ENGINEER = "Engineer",
  CLIENT = "Client",
}

export enum JobTypes {
  FULL = "Full-Time",
  PART = "Part-Time",
  CONTRACT = "Contract",
  TEMPORARY = "Temporary",
  INTERSHIP = "Internship",
}

export enum ProjectTypes {
  REMOTE = "Remote",
  ONBOARD = "Onboard",
}

export enum SkillScopes {
  ROLE_SPECIFIC = "Role Specific",
  SECTOR_SPECIFIC = "Sector Specific",
  CROSS_SPECIFIC = "Cross Sector",
  GLOBAL_SCOPE = "Global Scope",
}

export enum AgencyTypes {
  BARCLAY_SEARCH = "Barclay Search",
  DIRECT = "Direct",
  TRILOGY = "Trilogy",
}

export enum ProjectLengthUnits {
  YEAR = "Year",
  MONTH = "Month",
}

export const AnalysisColors:any = {
  "total_skilled_engineers":"info",
  "assigned_roles":"dark",
  "claimed_skills":"secondary",
  "project_assignments":"warning",
  "learning_activities":"error",
  "goals_accomplished":"success",
  "external_registrants":"black"
}

export enum PropositionTypes {
  MONITORED_OUTCOME = 'Monitored Outcome',
  MANAGED_OUTCOME = 'Managed Outcome',
  FIXED_OUTCOME = 'Fixed Outcome',
  PARTNER_FRAMEWORK = 'Partner Framework'
}

export enum RateFrequency {
  PerHour = "Hour",
  PerDay = "Day",
}

export enum RateCurrency {
  USD = "USD",
}

export enum RatePaymentVia {
  Direct = "Direct",
  AEJ = "AEJ",
  BarclaySearch = "Barclay Search",
  Triology = "Triology",
}