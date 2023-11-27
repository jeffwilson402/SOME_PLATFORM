export type FormField = {
  name: string;
  label: string;
  type?: string;
  errorMsg?: string;
  invalidMsg?: string;
};

// doesn't like having dynamic keys
// since there are also static keys
// with different types
export type FormType = {
  email: FormField;
  firstName: FormField;
  lastName: FormField;
  type: FormField;
  approved: FormField;
  jobType: FormField;
  hasOwnCompany: FormField;
  companyName: FormField;
  companyAddress: FormField;
  companyPhone: FormField;
  companyVat: FormField;
  companyId: FormField;
  paymentDate: FormField;
  rate: FormField;
  per: FormField;
  currency: FormField;
  payVia: FormField;
  personal_email: FormField;
  telephone: FormField;
  bpss: FormField;
  ctc: FormField;
  sc: FormField;
  esc: FormField;
  dv: FormField;
  edv: FormField;
  location: FormField;
  timezone: FormField;
  language: FormField;
  note: FormField;
  notes: FormField;
  roles: FormField;
  skills: FormField;
  files: FormField;
  projectDetail: {
    name: string;
    label: string;
    projectId: FormField;
    projectClient: FormField;
    projectStart: FormField;
    projectEnd: FormField;
    projectType: FormField;
    proposition: FormField;
  };
};

const form: { formId: string; formField: FormType } = {
  formId: "new-user-form",
  formField: {
    email: {
      name: "email",
      label: "Distributed Email Address*",
      type: "email",
      errorMsg: "Email address is required.",
      invalidMsg: "Your email address is invalid",
    },
    firstName: {
      name: "firstName",
      label: "First Name*",
      type: "text",
      errorMsg: "First name is required.",
    },
    lastName: {
      name: "lastName",
      label: "Last Name*",
      type: "text",
      errorMsg: "Last name is required.",
    },
    type: {
      name: "type",
      label: "Select User Type*",
      errorMsg: "Type is required.",
    },
    approved: {
      name: "approved",
      label: "Tick if this user is approved for projects",
    },
    jobType: {
      name: "jobType",
      label: "Job Type",
    },
    projectDetail: {
      name: "projectDetail",
      label: "Project Detail",
      // label: "Projects",
      projectId: {
        name: "projectId",
        label: "Project",
      },
      projectClient: {
        name: "projectClient",
        label: "Client",
      },
      projectStart: {
        type: "date",
        name: "projectStart",
        label: "Project Start",
      },
      projectEnd: {
        type: "date",
        name: "projectEnd",
        label: "Project End",
      },
      projectType: {
        name: "projectType",
        label: "Project Type",
      },
      proposition: {
        name: "proposition",
        label: "Proposition",
      },
    },
    hasOwnCompany: {
      name: "hasOwnCompany",
      label: "Do you have a company?",
    },
    //Company Details
    companyName: {
      name: "companyName",
      label: "Company Name",
      type: "text",
    },
    companyAddress: {
      name: "companyAddress",
      label: "Company Address",
      type: "text",
    },
    companyPhone: {
      name: "companyPhone",
      label: "Company Telephone",
      type: "text",
    },
    companyVat: {
      name: "companyVat",
      label: "VAT",
      type: "text",
    },
    companyId: {
      name: "companyId",
      label: "Company ID",
      type: "text",
    },
    // payment
    paymentDate: {
      name: "paymentDate",
      label: "date",
      type: "date",
      errorMsg: "Payment Date is required",
    },
    rate: {
      name: "amount",
      label: "Pay Rate*",
      type: "number",
      errorMsg: "Rate is required",
    },
    per: {
      name: "frequency",
      label: "Per Hour or Day*",
      type: "text",
      errorMsg: "Per is required.",
    },
    currency: {
      name: "currency",
      label: "Chosen Currency*",
      type: "text",
      errorMsg: "Currency is required.",
    },
    payVia: {
      name: "paymentVia",
      label: "Payment Made Via*",
      type: "text",
      errorMsg: "This field is required.",
    },
    // ======
    personal_email: {
      name: "personal_email",
      label: "Personal Email Address",
      type: "email",
      errorMsg: "Email address is required.",
      invalidMsg: "Your email address is invalid",
    },
    telephone: {
      name: "telephone",
      label: "Phone Number",
      type: "number",
      errorMsg: "Telephone is required",
    },
    //Security
    bpss: {
      name: "bpss",
      label: "BPSS-Baseline Personnel Security Standard",
    },
    ctc: {
      name: "ctc",
      label: "CTC - Counter Terrorist Check",
    },
    sc: {
      name: "sc",
      label: "SC - Security Check",
    },
    esc: {
      name: "esc",
      label: "eSC - Enhanced Security Check",
    },
    dv: {
      name: "dv",
      label: "DV - Developed Vetting",
    },
    edv: {
      name: "edv",
      label: "eDV-Enhanced Developed Vetting",
    },
    //Location
    location: {
      name: "location",
      label: "Location*",
      type: "text",
      errorMsg: "Location is required.",
    },
    timezone: {
      name: "timezone",
      label: "Time Zone*",
      type: "text",
      errorMsg: "TimeZone is required.",
    },
    language: {
      name: "language",
      label: "Language*",
      type: "text",
      errorMsg: "Language is required.",
    },
    note: {
      name: "note",
      label: "Note",
      type: "text",
    },
    notes: {
      name: "notes",
      label: "Notes",
    },
    //Others
    roles: {
      name: "roles",
      label: "Role",
    },
    skills: {
      name: "skills",
      label: "Skills",
    },
    files: {
      name: "files",
      label: "Files",
    },
  },
};

export default form;
