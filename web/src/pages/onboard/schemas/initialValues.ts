/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import checkout from "./form";
import {
  ProjectTypes,
  JobTypes,
  ProjectLengthUnits,
  PropositionTypes,
  RateFrequency,
  RateCurrency,
  RatePaymentVia,
} from "interfaces/enums";

const {
  formField: {
    firstName,
    lastName,
    email,
    approved,
    jobType,
    projectDetail,
    // projectId,
    // projectStart,
    // projectLength,
    // projectLengthUnit,
    // projectType,
    hasOwnCompany,
    companyName,
    companyAddress,
    companyPhone,
    companyVat,
    companyId,
    personal_email,
    telephone,
    note,
    notes,
    bpss,
    ctc,
    sc,
    esc,
    dv,
    edv,
    roles,
    skills,
    files,
  },
} = checkout;

export type ProjectDetailType = {
  projectId: {
    _id: string;
    name: string;
  };
  projectStart: string;
  projectEnd: string;
  projectType: ProjectTypes.ONBOARD;
  proposition: PropositionTypes.MONITORED_OUTCOME;
  projectClient: string;
};
export type RoleType = {
  _id: string;
  name: string;
};
export type SkillType = {
  _id: string;
  name: string;
  description: string;
};
export type PaymentInfoType = {
  paymentDate: Date;
  amount: number;
  frequency: RateFrequency;
  currency: RateCurrency;
  paymentVia: RatePaymentVia;
};

export type FormValueType = {
  [key: string]:
    | number
    | string
    | JobTypes
    | Date
    | boolean
    | Array<ProjectDetailType>
    | Array<RoleType>
    | Array<SkillType>
    | Array<PaymentInfoType>;
};

const initialValues: FormValueType = {
  [firstName.name]: "",
  [lastName.name]: "",
  [email.name]: "",
  [approved.name]: false,
  [jobType.name]: JobTypes.FULL,
  [projectDetail.name]: [
    {
      projectId: { _id: "", name: "" },
      projectStart: new Date().toISOString().slice(0, 10),
      projectEnd: new Date().toISOString().slice(0, 10),
      projectType: ProjectTypes.ONBOARD,
      proposition: PropositionTypes.MONITORED_OUTCOME,
      projectClient: "",
    },
  ],
  [hasOwnCompany.name]: false,
  [companyName.name]: "",
  [companyAddress.name]: "",
  [companyPhone.name]: "",
  [companyVat.name]: "",
  [companyId.name]: "",
  [personal_email.name]: "",
  [telephone.name]: "",
  [note.name]: "",
  [bpss.name]: false,
  [ctc.name]: false,
  [sc.name]: false,
  [esc.name]: false,
  [dv.name]: false,
  [edv.name]: false,
  [roles.name]: null,
  [skills.name]: [],
  paymentInfo: [],
};

export default initialValues;
