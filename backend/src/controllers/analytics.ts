import { Request, Response } from "express";
import { UserTypes } from "../constants/enum";
import userModel from "../models/user";

export const getInfo = async (req: Request, res: Response) => {
  try {
    const engineers = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      { $unwind: "$skills" },
      { $group: { _id: "$email", skillCount: { $sum: 1 } } },
      { $match: { skillCount: { $gte: 1 } } },
    ]);
    const numRoles: any = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      {
        $group: {
          _id: "$roles.name",

          totalRoles: { $addToSet: "$roles.name" },
        },
      },
      { $unwind: "$totalRoles" },
      { $unwind: "$totalRoles" },
      { $group: { _id: "$totalRoles", roleCount: { $sum: 1 } } },
      { $group: { _id: "$totalRoles", sum: { $sum: "$roleCount" } } },
    ]);
    const claimedSkills: any = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      {
        $group: {
          _id: "$skills.name",
          totalSkills: { $addToSet: "$skills.name" },
        },
      },
      { $unwind: "$totalSkills" },
      { $unwind: "$totalSkills" },
      { $group: { _id: "$totalSkills", skillCount: { $sum: 1 } } },
      { $group: { _id: "$totalSkills", sum: { $sum: "$skillCount" } } },
    ]);
    const projectAssignments = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      {
        $group: {
          _id: "$projectDetail.name",
          totalProjects: { $addToSet: "$projectDetail.name" },
        },
      },
      { $unwind: "$totalProjects" },
      { $unwind: "$totalProjects" },
      { $group: { _id: "$totalProjects", projectCount: { $sum: 1 } } },
      { $group: { _id: "$totalProjects", sum: { $sum: "$projectCount" } } },
    ]);
    const numOfEngineers = await userModel
      .find({ type: UserTypes.ENGINEER })
      .count();
    //Goals Accomplished
    const goalsAccomplished = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      { $unwind: "$goals" },
      { $match: { $expr: { $eq: ["goals.status", true] } } },
      { $group: { _id: "email", goalCount: { $sum: 1 } } },
    ]);
    const goalsTotal = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      { $unwind: "$goals" },
      { $group: { _id: "email", goalCount: { $sum: 1 } } },
    ]);
    res.send({
      total_skilled_engineers: engineers.length,
      assigned_roles: numRoles.length ? numRoles[0].sum : 0,
      claimed_skills: claimedSkills.length ? claimedSkills[0].sum : 0,
      project_assignments: projectAssignments.length
        ? projectAssignments[0].sum
        : 0,
      external_registrants: numOfEngineers,
      goals_accomplished:
        goalsAccomplished.length &&
        `${(
          (goalsAccomplished[0]?.goalCount / goalsTotal[0]?.goalCount) *
          100
        ).toFixed(2)}% (${goalsAccomplished[0].goalCount} of ${
          goalsTotal[0].goalCount
        })`,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
};

export const getTotalSkilledEngineers = async (req: Request, res: Response) => {
  try {
    const engineers = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      { $unwind: "$skills" },
      { $group: { _id: "$email", skillCount: { $sum: 1 } } },
      { $sort: { skillCount: -1 } },
    ]);
    const labels = engineers.map((e: any) => e._id);
    const data = engineers.map((e: any) => e.skillCount);
    res.send({ data, labels });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
};

export const getAssignedRoles = async (req: Request, res: Response) => {
  try {
    const result = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      {
        $group: {
          _id: "$roles.name",

          totalRoles: { $addToSet: "$roles.name" },
        },
      },
      { $unwind: "$totalRoles" },
      { $unwind: "$totalRoles" },
      { $group: { _id: "$totalRoles", roleCount: { $sum: 1 } } },
      { $sort: { roleCount: -1 } },
    ]);
    const labels = result.map((e: any) => e._id);
    const data = result.map((e: any) => e.roleCount);
    res.send({ labels, data });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
};

export const getClaimedSkills = async (req: Request, res: Response) => {
  try {
    const result = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      {
        $group: {
          _id: "$skills.name",
          totalSkills: { $addToSet: "$skills.name" },
        },
      },
      { $unwind: "$totalSkills" },
      { $unwind: "$totalSkills" },
      { $group: { _id: "$totalSkills", skillCount: { $sum: 1 } } },
      { $sort: { skillCount: -1 } },
    ]);
    const labels = result.map((e: any) => e._id);
    const data = result.map((e: any) => e.skillCount);
    res.send({ labels, data });
  } catch (error) {}
};

export const getProjectAssignments = async (req: Request, res: Response) => {
  try {
    const result = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      {
        $group: {
          _id: "$projectDetail.name",
          totalProjects: { $addToSet: "$projectDetail.name" },
        },
      },
      { $unwind: "$totalProjects" },
      { $unwind: "$totalProjects" },
      { $group: { _id: "$totalProjects", projectCount: { $sum: 1 } } },
      { $sort: { projectCount: -1 } },
    ]);
    const labels = result.map((e: any) => e._id);
    const data = result.map((e: any) => e.projectCount);
    res.send({ labels, data });
  } catch (error) {}
};

export const getExternalRegistrants = async (req: Request, res: Response) => {
  try {
    const result = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      {
        $group: { _id: "$sourceID", count: { $sum: 1 } },
      },
      { $sort: { _id: 1 } },
    ]);
    const labels = ["WebSite", "Engineer Site", "SalesForce", "Api", "Old DB"];
    let data = labels.map((label: string, i: number) => {
      const found = result.find((r: any) => r._id === i + 1);
      if (found) return found.count;
      else return 0;
    });
    res.send({ labels, data });
  } catch (error) {}
};

export const getGoalsAnalysis = async (req: Request, res: Response) => {
  try {
    const result = await userModel.aggregate([
      { $match: { type: UserTypes.ENGINEER } },
      // {
      //   $group: {
      //     _id: "$goals.name",
      //     goals: { $addToSet: "$goals.name" },
      //     status: { $addToSet: "$goals.status" },
      //   },
      // },
      { $unwind: "$goals" },
      {
        $group: {
          _id: "$email",
          goals: { $push: "$goals" },
          goalCount: { $sum: 1 },
        },
      },
      // { $addFields: ["status"] },
      // { $group: { _id: "$goals", goalCount: { $sum: 1 } } },
      { $sort: { goalCount: -1 } },
    ]);
    // const result = await userModel
    //   .find({ goals: { $exists: true, $ne: [] } })
    //   .lean();
    const labels = result.map((r: any) => r._id);
    const dones = result.map((r: any) => {
      const done = r.goals.filter((goal: any) => goal.status).length;
      return done;
    });
    const notDones = result.map((r: any) => {
      const done = r.goals.filter((goal: any) => goal.status).length;
      const notDone = r.goalCount - done;
      return notDone;
    });
    res.send({ labels, data: [dones, notDones] });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
};
