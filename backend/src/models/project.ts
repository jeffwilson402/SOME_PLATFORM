import { model, Schema } from "mongoose";
import { IProject } from "../constants/interfaces";

const Project = new Schema<IProject>({
  _id: {
    type: String,
    required: true,
  },
  refID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  description: {
    type: String,
  },
  team: [
    {
      userID: {
        type: String,
        ref: "user",
      },
      email: String,
      userType: String,
      firstName: String,
      lastName: String,
      startDate: Date,
      endDate: Date,
    },
  ],
  documents: {
    type: [
      {
        file_id: Schema.Types.ObjectId,
        file_name: String,
        uploadedAt: Date,
      },
    ],
  },
});

const projectModel = model<IProject>("project", Project);

export default projectModel;
