export enum UserTypes {
  CORE = "Core Team Member",
  ENGINEER = "Engineer",
  CLIENT = "Client",
}

export enum FileTypes {
  "docx",
  "doc",
  "pdf",
  "txt",
  "png",
  "jpeg",
  "jpg",
  "xls",
  "xlsx",
  "rtf",
}

export const fileSizeLimit = 5; // 5MB

export enum ScopeTypes {
  ROLE_SPECIFIC = "Role Specific",
  SECTOR_SPECIFIC = "Sector Specific",
  CROSS_SECTOR = "Cross Sector",
  GLOBAL_SCOPE = "Global Scope",
}
