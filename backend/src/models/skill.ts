import { model, Schema } from "mongoose";

const Skill = new Schema({
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
  indexKey: String,
  defaultScope: {
    type: String,
    enum: ["Role Specific", "Sector Specific", "Cross Sector", "Global Scope"],
  },
  parentSkills: [
    {
      refID: String,
      indexKey: String,
    },
  ],
  childSkills: [
    {
      refID: String,
      indexKey: String,
    },
  ],
  roles: [
    {
      refID: String,
      indexKey: String,
    },
  ],
});

const skillModel = model("skill", Skill);

export default skillModel;
