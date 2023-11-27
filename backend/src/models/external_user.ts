import { model, Schema } from "mongoose";

export const ExternalUserCollectionName = "external_user";

export type ExternalUserUnit = {
  refID: string;
  name: string;
};

export interface ExternalUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  availablity: Date;
  createdAt: Date;
  skills: ExternalUserUnit[];
  roles: ExternalUserUnit[];
  location: string;
}

export const ExternalUserSchema = new Schema<ExternalUser>({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  availablity: {
    type: Date,
    required: true,
  },
  roles: [
    {
      refID: {
        type: String,
        ref: "role",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  skills: [
    {
      refID: {
        type: String,
        ref: "skill",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
});

const externalUserModel = model(ExternalUserCollectionName, ExternalUserSchema);

export default externalUserModel;
