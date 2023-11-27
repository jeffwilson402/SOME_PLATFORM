import { model, Schema } from "mongoose";

const roleCategory = new Schema({
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
  roles: [
    {
      refID: {
        type: String,
        ref: "role",
      },
      name: String,
      indexKey: String,
    },
  ],
  sequence: Number,
});

const roleCategoryModel = model("role_category", roleCategory);

export default roleCategoryModel;
