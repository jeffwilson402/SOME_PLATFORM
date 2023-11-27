import { Request, Response } from "express";
import RoleCategory from "../models/role_category";
import Role from "../models/role";
import mongoose from "mongoose";

export const saveRoleCategory = async (req: Request, res: Response) => {
  const category = req.body;
  try {
    if (category._id) {
    } else {
      await RoleCategory.create(category);
      res.send({ message: "ok" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

export const getRoleCategories = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    let categories;
    if (role) {
      categories = await RoleCategory.aggregate([
        {
          $lookup: {
            from: "category_roles",
            localField: "roles.refID",
            foreignField: "refID",
            as: "roles",
          },
        },
      ]);
    } else {
      categories = await RoleCategory.aggregate([
        {
          $lookup: {
            from: "category_role",
            let: { role_id: "$roles.refID" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$refID", "$$role_id"] }],
                  },
                },
              },
            ],
            as: "roless",
          },
        },
      ]);
    }
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something Went Wrong!" });
  }
};

export const saveRole = async (req: Request, res: Response) => {
  try {
    const { _id, skills, name, description, category } = req.body;
    const skillsForRole = skills?.map((skill: any) => ({
      refID: skill.refID,
      scope: skill.scope,
      required: skill.required || true,
    }));
    if (_id) {
      await Role.findByIdAndUpdate(_id, {
        name,
        description,
        category: category?._id,
        skills: skillsForRole,
      });
    } else {
      const check = await Role.findOne({ name });
      if (check) {
        return res.status(400).send({ message: "The Role already exists!" });
      }

      const role = {
        name,
        description,
        active: false,
        category: category._id,
        skills: skillsForRole,
      };
      console.log(role);
      const created = await Role.create(role);
      await RoleCategory.findByIdAndUpdate(category._id, {
        $push: {
          // @ts-ignore
          roles: created._id,
        },
      });
    }
    res.send({ message: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Error!" });
  }
};

export const moveToActiveRole = async (req: Request, res: Response) => {
  const { name, role } = req.body;
  try {
    const check = await Role.findOne({ name, active: true });
    if (check)
      return res.status(400).send({ message: "The Role Name already Exists!" });
    const { _id, ...rest } = role;
    const newActiveRole = {
      ...rest,
      name,
      active: true,
    };
    await Role.create(newActiveRole);
    res.send({ message: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Error!" });
  }
};

export const getActiveRoles = async (req: Request, res: Response) => {
  try {
    const { searchKey, perPage, currentPage } = req.body;
    if (perPage == 0) {
      const data = await Role.find();
      res.send(data);
    } else {
      const data = await Role.find({
        $or: [
          { name: { $regex: searchKey, $options: "i" } },
          { description: { $regex: searchKey, $options: "i" } },
        ],
      })
        .skip(currentPage * perPage)
        .limit(perPage);
      const count = await Role.find({
        name: { $regex: searchKey, $options: "i" },
        description: { $regex: searchKey, $options: "i" },
      }).count();
      res.send({ data, count });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Error!" });
  }
};

export const getActiveRoleOptions = async (req: Request, res: Response) => {
  try {
    const data = await Role.find();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Error!" });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  const { refID } = req.params;
  try {
    // const role: any = await Role.aggregate([
    //   {
    //     $match: { refID },
    //   },
    //   {
    //     $lookup: {
    //       from: "schema_skills",
    //       localField: "skills.refID",
    //       foreignField: "refID",
    //       as: "skill",
    //     },
    //   },
    // ]);
    const role = await Role.findOne({ refID });
    // .populate("skills._id");
    // console.log(role.skills);
    // const modifiedSkills = role.skills.map((skill: any) => ({
    //   skill: skill._id,
    //   required: skill.required,
    //   scope: skill.scope,
    // }));
    res.send(role);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Error!" });
  }
};
