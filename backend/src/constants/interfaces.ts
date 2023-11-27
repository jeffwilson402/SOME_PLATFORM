import { ScopeTypes } from "./enum";

/* Project Schema Interfaces */
export interface IProject {
  _id: string;
  refID: string;
  name: string;
  code: string;
  type: string;
  logo: string;
  description: string;
  team: ITeamMember[];
  documents: IProjectDocument[];
}

export interface IProjectDocument {
  file_id: string;
  file_name: string;
  uploadedAt: Date;
}

export interface ITeamMember {
  userID: string;
  email: string;
  userType: string;
  firstName: string;
  lastName: string;
  startDate?: Nullable<Date | number>;
  endDate?: Nullable<Date | number>;
}

/* User Schema Interfaces */
export interface IUser {
  _id: string;
  refID: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  telephone: string;
  personal_email: string;
  avatar: string;
  type: string;
  approved_project: boolean;
  projectDetail: IUserProjectDetail[];
  jobTitle: String; // Senior Software Engineer etc...
  jobType: string;
  notes: [
    {
      note: string;
      createdAt: Date;
    }
  ];
  permission: any;
  approved: boolean;
  payment: {
    // For Engineer
    rate: number;
    per: string;
    currency: string;
    pay_via: string;
  };
  paymentInfo: [
    {
      paymentDate: Date;
      amount: number;
      frequency: string;
      currency: string;
      paymentVia: string;
    }
  ];
  budget: {
    rate: number;
    per: string;
    currency: string;
  };
  hasOwnCompany: boolean;
  companyDetails: {
    name: string;
    address: string;
    phone: string;
    VAT: string;
    companyId: string;
  };
  clearance: {
    bpss: boolean;
    ctc: boolean;
    sc: boolean;
    esc: boolean;
    dv: boolean;
    edv: boolean;
  };
  place: {
    location: string;
    timezone: string;
    language: string;
  };
  roles: IUserRole[];
  skills: IUserSkill[];
  goals?: IUserGoal[];
  files: IUserFile[];
  isActive: boolean;
  sourceID: number;
  lastLogin: Date;
  emailApproved: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;

  //Candidates
  connected: boolean;
  teamTailorLink: string;
  facebookProfile: string;
  linkedinProfile: string;
  unsubscribed: boolean;
  sourced: boolean;
  referred: boolean;
  referringSite: string;
  originalResume: string;
  details: any;
  picture: string;
  availablity: Date;
}

export interface IUserProjectDetail {
  refID: string;
  name: string;
  projectStart?: Nullable<Date | number>;
  projectLength?: number;
  projectEnd?: Nullable<Date | number>;
  projectLengthUnit?: string;
  projectType?: string;
}

export interface IUserRole {
  refID: string;
  indexKey?: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface IUserSkill {
  refID: string;
  indexKey?: string;
  name: string;
  level: number;
  claimDate: Date;
  approved: boolean;
  approvedBy: string;
}

export interface IUserGoal {
  skillID: string;
  name: string;
  status?: boolean; //True if achieved
  startDate: Date;
  targetDate: Date;
}

export interface IUserFile {
  file_id: string;
  file_name: string;
  uploadedBy?: string;
  uploadedAt?: Date;
  isDeleted?: boolean;
}

/* SchemaSkill Schema Interfaces */
export interface ISchemaSkill {
  _id: string;
  refID: string;
  name: string;
  indexKey: string;
  description: string;
  skillGroupID: string;
  defaultScope: ScopeTypes;
  parentSkills: IUnit;
  childSkills: IUnit[];
  roles: IUnit[];
}

export interface IUnit {
  refID: string;
  name?: string;
  indexKey?: string;
}

export interface ISelectInput {
  _id: string;
  name: string;
}

export interface IUserToken {
  accessToken: string;
  refreshToken: string;
}
