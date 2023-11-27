import { model, Schema } from "mongoose";

const Role = new Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  parentID: String,
  skills: [
    {
      refID: String,
      name: String,
      scope: {
        type: String,
        enum: [
          "Role Specific",
          "Sector Specific",
          "Cross Sector",
          "Global Scope",
        ],
      },
      optional: Boolean,
    },
  ],
});

const roleModel = model("role", Role);

export default roleModel;
