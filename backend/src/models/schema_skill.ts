import { model, Schema } from "mongoose";

const SchemaSkill = new Schema({
  _id:{
    type:String,
    required:true,
  },
  refID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  indexKey: String,
  description: {
    type: String,
    default: "",
  },
  skillGroupID: String,
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

const SchemaSkillModel = model("schema_skill", SchemaSkill);

export default SchemaSkillModel;
