import mongoose, { ConnectOptions } from "mongoose";
import { getMongoUrl } from '../db';
import categoryRoleModel from "../models/category_role";
import projectModel from "../models/project";
import roleModel from "../models/role";
import roleCategoryModel from "../models/role_category";
import SchemaRoleModel from "../models/schema_role";
import SchemaSkillModel from "../models/schema_skill";
import skillModel from "../models/skill";
import userModel from "../models/user";

export const transfer = async () => {
  const mongoUrl = await getMongoUrl();
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true, // default recommended options
    useUnifiedTopology: true,
  } as ConnectOptions);
  console.log("First Connected");
  const users = await SchemaSkillModel.find();
  console.log(users.length);
  await mongoose.connection.close();
  const second_uri =
    "";
  await mongoose.connect(second_uri, {
    useNewUrlParser: true, // default recommended options
    useUnifiedTopology: true,
  } as ConnectOptions);
  console.log("Second COnnected");
  await SchemaSkillModel.insertMany(users);
  console.log("Finished!");
};
