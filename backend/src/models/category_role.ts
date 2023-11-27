import { model, Schema } from "mongoose";

const categoryRole = new Schema({
  _id: {
    type: String,
    required: true,
  },
  // refID: {
  //   type: String,
  //   required: true,
  // },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  indexKey: String,
  skills: [
    {
      refID: String,
      indexKey: String,
      optional: Boolean,
      scope: {
        type: String,
        enum: [
          "Role Specific",
          "Sector Specific",
          "Cross Sector",
          "Global Scope",
        ],
      },
    },
  ],
});

const categoryRoleModel = model("category_role", categoryRole);

export default categoryRoleModel;
