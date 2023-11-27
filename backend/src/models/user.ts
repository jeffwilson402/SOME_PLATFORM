import { model, Schema } from "mongoose";
import { IUser } from "../constants/interfaces";

const User = new Schema<IUser>({
  _id: String,
  refID: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
  },
  telephone: String,
  personal_email: String,
  avatar: String,
  type: {
    type: String,
    enum: ["Core Team Member", "Engineer", "Client"],
  }, // Engineer, Core Team Member
  approved_project: Boolean,
  projectDetail: [
    {
      refID: {
        type: String,
        ref: "project",
      },
      name: {
        type: String,
        required: true
      },
      projectStart: {
        type: Date,
      },
      projectEnd: {
        type: Date,
      },
      projectType: {
        type: String,
        enum: ["Onboard", "Remote"],
        default: "Onboard",
      },
      proposition: {
        type: String,
        enum: [
          "Monitored Outcome",
          "Managed Outcome",
          "Fixed Outcome",
          "Partner Framework",
        ]
      }
    },
  ],
  jobTitle: String, // Senior Software Engineer
  jobType: {
    type: String,
    enum: [
      "Full-Time",
      "Part-Time",
      "Contract",
      "Temporary",
      "Internship",
      "None",
    ],
    default: "None",
  }, // [Full-Time, Part-Time,,,,]
  notes: [
    {
      note: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  permission: Schema.Types.Mixed,
  approved: { type: Boolean, default: false },
  paymentInfo: [{
    paymentDate: Date,
    amount: Number,
    frequency: String,
    currency: String,
    paymentVia: String
  }],
  budget: {
    rate: Number,
    per: String,
    currency: String,
  },
  hasOwnCompany: {
    type: Boolean,
    default: false,
  },
  companyDetails: {
    name: String,
    address: String,
    phone: String,
    VAT: String,
    companyId: String,
  },
  clearance: {
    bpss: Boolean,
    ctc: Boolean,
    sc: Boolean,
    esc: Boolean,
    dv: Boolean,
    edv: Boolean,
  },
  place: {
    location: String,
    timezone: String,
    language: String,
  },
  roles: [
    {
      refID: {
        type: String,
        ref: "role",
      },
      indexKey: String,
      name: String,
      startDate: Date,
      endDate: Date,
    },
  ],
  skills: [
    {
      refID: {
        type: String,
        ref: "skill",
      },
      indexKey: String,
      name: String,
      level: Number,
      claimDate: Date,
      approved: Boolean,
      approvedBy: {
        type: String,
        ref: "user",
      },
    },
  ],
  goals: [
    {
      skillID: {
        type: String,
        ref: "skill",
      },
      name: String,
      status: Boolean, //True if achieved
      startDate: {
        type: Date,
        default: new Date(),
      },
      targetDate: {
        type: Date,
      },
    },
  ],
  files: [
    {
      file_id: String,
      file_name: String,
      uploadedBy: String,
      uploadedAt: {
        type: Date,
        default: new Date(),
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: false,
  },
  sourceID: Number,
  lastLogin: Date,
  emailApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: Schema.Types.ObjectId,
  updatedAt: Date,
  updatedBy: Schema.Types.ObjectId,

  //Candidates
  connected: Boolean,
  teamTailorLink: String,
  facebookProfile: String,
  linkedinProfile: String,
  unsubscribed: Boolean,
  sourced: Boolean,
  referred: Boolean,
  referringSite: String,
  originalResume: String,
  details: Schema.Types.Mixed,
  picture: String,
  availablity: Date,
});

const userModel = model<IUser>("user", User);

export default userModel;
