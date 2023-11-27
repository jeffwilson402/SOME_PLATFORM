import { model, Schema } from "mongoose";

const SchemaRole = new Schema({
  _id: {
    type: String,
    required: true,
  },
  refID: {
    type: String,
    required: true,
  },
  indexKey: String,
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

const SchemaRoleModel = model("schema_role", SchemaRole);

export default SchemaRoleModel;
