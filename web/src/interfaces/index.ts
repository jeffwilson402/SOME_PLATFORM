export type TDocument = {
  _id?: string;
  file_id: string;
  file_name: string;
  uploadedAt: string;
  [key: string]: any;
};

export interface IProject {
  _id?: string;
  name: string;
  code: string;
  type: string;
  description: string;
  logo?: string;
  documents?: TDocument[];
}

export interface ISkill {
  _id?: string;
  name: string;
  description: string;
  [key: string]: any;
}

export enum ProjectTypes {
  FIXED_OUTCOME = "Fixed Outcome",
  MANAGED_OUTCOME = "Managed Outcome",
  MANAGED_PROJECT = "Managed Project",
}

export interface IRole {
  _id?: string;
  name: string;
  description: string;
  category: any;
  skills: ISkill[];
}
