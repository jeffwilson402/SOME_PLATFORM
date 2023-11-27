import {
  TableServiceClient,
  AzureNamedKeyCredential,
  TableClient,
  ListTableEntitiesOptions,
  odata,
  TableEntityResult,
  TableEntity,
} from "@azure/data-tables";
import { readFileSync } from "fs";
import { readdir } from "fs/promises";
import { IUser, IUserProjectDetail } from '../constants/interfaces';
import Skill from "../models/skill";
import roleCategoryModel from "../models/role_category";
import categoryRoleModel from "../models/category_role";
import SchemaRoleModel from "../models/schema_role";
import SchemaSkillModel from "../models/schema_skill";
import roleModel from "../models/role";
import userModel from "../models/user";
import projectModel from "../models/project";
import axios from "axios";

const systemTenant = "826CE724-4CCC-4D03-A30A-876D377831E1";
const tenantID = "4DE9DA16-1EA0-418E-B135-3A6EED60BAD3";
const account = "";
const accountKey =
  "";

const credential = new AzureNamedKeyCredential(account, accountKey);
const serviceClient = new TableServiceClient(
  `https://${account}.table.core.windows.net`,
  credential
);

let match: any = {
  "Occupation-Specific": "Role Specific",
  "Sector-Specific": "Sector Specific",
  "Cross-Sector": "Cross Sector",
  Transversal: "Global Scope",
};
export async function importSkills() {
  const tableName = "Competency";
  const client = new TableClient(
    `https://${account}.table.core.windows.net`,
    tableName,
    credential
  );
  const skillXSkillClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "CompetencyXCompetency",
    credential
  );
  const skillXSkillReverseClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "CompetencyXCompetencyReverse",
    credential
  );

  const roleXSkillClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "OccupationXCompetencyReverse",
    credential
  );
  const data = readFileSync(`${__dirname}/2.txt`, "utf8");
  const ids = data.split("\r\n");
  // const temp_ids = ids.slice(0, 10);
  // console.log(temp_ids);
  let entitiesIter = client.listEntities();
  let skills = [];
  for await (const entity of entitiesIter) {
    let temp: any = entity;
    if (ids.includes(temp["CompetencyID"])) {
      const children = skillXSkillClient.listEntities({
        queryOptions: { filter: odata`PartitionKey eq ${temp.CompetencyID}` },
      });
      const parents = skillXSkillReverseClient.listEntities({
        queryOptions: { filter: odata`PartitionKey eq ${temp.CompetencyID}` },
      });

      const roles = roleXSkillClient.listEntities({
        queryOptions: { filter: odata`CompetencyID eq ${temp.CompetencyID}` },
      });
      let row = {
        _id: entity.CompetencyID,
        name: entity.Label,
        indexKey: entity.partitionKey,
        description: entity.description || "",
        defaultScope: match[temp.DefaultScope.split(". ")[1]],
        parentSkills: <any[]>[],
        childSkills: <any[]>[],
        roles: <any[]>[],
      };
      for await (const child of children) {
        row.childSkills.push({
          refID: child.CompetencyChildID,
          indexKey: child.CompetencyChildPartitionKey,
        });
      }

      for await (const parent of parents) {
        row.parentSkills.push({
          refID: parent.CompetencyChildID,
          indexKey: parent.CompetencyChildPartitionKey,
        });
      }
      for await (const role of roles) {
        row.roles.push({
          refID: role.OccupationID,
          indexKey: role.OccupationPartitionKey,
        });
      }
      skills.push(row);
      console.log(row);
      await Skill.create(row);
    }
    // if (skills.length == 10) break;
  }
  // await Skill.insertMany(skills);
  console.log("Importing Skills Finished!");
}

export async function importRoleCategory() {
  const tableName = "RoleCategory";
  const categoryClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    tableName,
    credential
  );
  const roleClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "RoleCategoryXRole",
    credential
  );
  let entitiesIter = categoryClient.listEntities();
  let categories = [];
  for await (const entity of entitiesIter) {
    console.log(entity);
    let role_category = {
      _id: entity.rowKey,
      name: entity.CategoryName,
      sequence: entity.OrderBy,
      roles: <any[]>[],
    };
    const roles = roleClient.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${entity.rowKey}` },
    });
    for await (const page of roles) {
      console.log(page.RoleID);
      const role_id: string = String(page.RoleID);
      if (page.RoleID)
        role_category.roles.push({
          refID: role_id,
          name: page.DisplayName,
          indexKey: page.RoleIndexKey,
        });
      // role_category.roles = [...role_category.roles,role_id];
    }
    categories.push(role_category);
    // break;
  }
  await roleCategoryModel.insertMany(categories);
  console.log("Role Category Import Finished!");
}

export async function importCategoryRoles() {
  const categoryRoleClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "RoleCategoryXRole",
    credential
  );
  const skillClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "OccupationXCompetency",
    credential
  );
  let categoryRoles = categoryRoleClient.listEntities();
  let data = [];
  for await (const entity of categoryRoles) {
    console.log(entity);
    let row = {
      name: entity.DisplayName,
      refID: entity.RoleID,
      indexKey: entity.RoleIndexKey,
      skills: <any[]>[],
    };
    const skills = skillClient.listEntities({
      queryOptions: { filter: odata`OccupationID eq ${entity.RoleID}` },
    });
    for await (const skill of skills) {
      row.skills.push({
        refID: skill.CompetencyID,
        indexKey: skill.CompetencyPartitionKey,
        optional: skill.Optional,
        scope: match[String(skill.ActualScope).split(". ")[1]],
      });
    }
    data.push(row);
    // break;
  }
  await categoryRoleModel.insertMany(data);
  console.log("Import CategoryRole FInished!");
}

export async function importSchemaRoles() {
  const roleClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "Occupation",
    credential
  );
  const skillClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "OccupationXCompetency",
    credential
  );
  let categoryRoles = roleClient.listEntities();
  let data = [],
    i = 0;
  for await (const entity of categoryRoles) {
    // console.log(entity);
    let row = {
      _id: entity.OccupationID,
      name: entity.Label,
      parentID: entity.ParentOccupationID,
      description: entity.Description,
      indexKey: entity.partitionKey,
      skills: <any[]>[],
    };
    const skills = skillClient.listEntities({
      queryOptions: { filter: odata`OccupationID eq ${entity.OccupationID}` },
    });
    for await (const skill of skills) {
      row.skills.push({
        refID: skill.CompetencyID,
        scope: match[String(skill.ActualScope).split(". ")[1]],
      });
    }
    data.push(row);
    if (data.length == 20) {
      await SchemaRoleModel.insertMany(data);
      data = [];
      console.log((i + 1) * 20);
      i++;
    }
    // break;
  }
  if (data.length < 20 && data.length > 0)
    await SchemaRoleModel.insertMany(data);
  console.log("Importing Schema Role Finished!");
}

export async function importSchemaSkills() {
  const skillClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "Competency",
    credential
  );
  const skillXSkillClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "CompetencyXCompetency",
    credential
  );
  const skillXSkillReverseClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "CompetencyXCompetencyReverse",
    credential
  );

  const roleXSkillClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "OccupationXCompetencyReverse",
    credential
  );
  let data = [];
  const skills = skillClient.listEntities();
  let i = 0;
  for await (const skill of skills) {
    const children = skillXSkillClient.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${skill.CompetencyID}` },
    });
    const parents = skillXSkillReverseClient.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${skill.CompetencyID}` },
    });

    const roles = roleXSkillClient.listEntities({
      queryOptions: { filter: odata`CompetencyID eq ${skill.CompetencyID}` },
    });
    let row = {
      refID: skill.CompetencyID,
      name: skill.Label,
      skillGroupID: skill.CompetencyGroupID,
      defaultScope: match[String(skill.DefaultScope).split(". ")[1]],
      parentSkills: <any[]>[],
      childSkills: <any[]>[],
      roles: <any[]>[],
    };
    for await (const child of children) {
      row.childSkills.push({
        refID: child.CompetencyChildID,
        indexKey: child.CompetencyChildPartitionKey,
      });
    }

    for await (const parent of parents) {
      row.parentSkills.push({
        refID: parent.CompetencyChildID,
        indexKey: parent.CompetencyChildPartitionKey,
      });
    }
    for await (const role of roles) {
      row.roles.push({
        refID: role.OccupationID,
        indexKey: role.OccupationPartitionKey,
      });
    }
    data.push(row);
    i++;
    if (i == 10) break;
  }
  console.log(data);
  await SchemaSkillModel.insertMany(data);
  console.log("Schema Skill Import Finished!");
}

export async function importRoles() {
  const roleClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "Occupation",
    credential
  );
  const skillClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "OccupationXCompetency",
    credential
  );
  const occupationClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "Competency",
    credential
  );
  const prefix = "4DE9DA16-1EA0-418E-B135-3A6EED60BAD3";
  const roles = roleClient.listEntities();
  let i = 0;
  let data = [];
  for await (const role of roles) {
    if (!role.partitionKey?.includes(prefix)) break;
    console.log(role.partitionKey);
    const skills = skillClient.listEntities({
      queryOptions: { filter: odata`OccupationID eq ${role.OccupationID}` },
    });
    let row = {
      _id: role.OccupationID,
      name: role.Label,
      description: role.description,
      parentID: role.ParentOccupationID,
      skills: <any[]>[],
    };
    for await (const skill of skills) {
      const occupation: any = await occupationClient.getEntity(
        String(skill.CompetencyPartitionKey),
        String(skill.CompetencyID)
      );
      console.log(occupation);
      row.skills.push({
        refID: skill.CompetencyID,
        name: occupation.Label,
        scope: match[String(skill.ActualScope).split(". ")[1]],
        optional: skill.Optional,
      });
    }
    data.push(row);
    // break;
  }
  await roleModel.insertMany(data);
  console.log("Active Roles Importing Finished!");
}

const userExceptions = [
  "admin@admin.com",
  "craig.chard@distributed.co",
  "zeeshan.abid@distributed.co",
  "iamtong157@gmail.com",
];
export async function importUsers() {
  await userModel.deleteMany({ email: { $nin: userExceptions } });
  console.log("User Table Cleared")!;
  // return;
  const userClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "User",
    credential
  );
  const userXCompetencyClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "UserXCompetency",
    credential
  );
  const competencyClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "Competency",
    credential
  );
  const userXOccupationClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "UserXOccupation",
    credential
  );
  const occupationClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "Occupation",
    credential
  );
  const userXProjectClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "UserXProject",
    credential
  );
  const projectClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "Project",
    credential
  );
  const agencyClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "Agency",
    credential
  );
  const goalClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "Goal",
    credential
  );
  const users = userClient.listEntities();
  let data = [];
  for await (const user of users) {
    //Goals
    const goals = goalClient.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${user.rowKey}` },
    });
    let userGoals = [];
    for await (const goal of goals) {
      const title_split = String(goal.Title).split(": ");
      userGoals.push({
        skillID: goal.TypeID,
        status: Boolean(goal.Status),
        startDate: goal.StartDate,
        name: title_split.length > 1 ? title_split[1] : goal.Title,
      });
    }
    //Skills
    const competencies = userXCompetencyClient.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${user.rowKey}` },
    });
    let skills = [];
    //Skills
    for await (const competency of competencies) {
      const skill = await competencyClient.getEntity(
        String(competency.CompetencyPartitionKey),
        String(competency.CompetencyID)
      );
      let temp = {
        refID: competency.CompetencyID,
        indexKey: competency.CompetencyPartitionKey,
        name: skill.Label,
        level: competency.SkillLevel,
        claimDate: competency.ClaimDate,
        approved: competency.Approved,
        approvedBy: competency.ApprovedBy,
      };
      skills.push(temp);
    }

    //Roles
    const occupations = userXOccupationClient.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${user.rowKey}` },
    });
    let roles = [];
    for await (const occupation of occupations) {
      const role = await occupationClient.getEntity(
        String(occupation.OccupationPartitionKey),
        String(occupation.OccupationID)
      );
      let temp = {
        refID: occupation.OccupationID,
        indexKey: occupation.OccupationPartitionKey,
        name: role.Label,
        startDate: occupation.StartDate,
        endDate: occupation.EndDate,
      };
      roles.push(temp);
    }
    //Projects
    const projects = userXProjectClient.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${user.rowKey}` },
    });
    let projectsField = [];
    for await (const project of projects) {
      let pro: any = {};
      try {
        pro = await projectClient.getEntity(
          "4DE9DA16-1EA0-418E-B135-3A6EED60BAD3",
          String(project.ProjectID)
        );
      } catch (error) {
        continue;
      }
      const split = String(project.StartDate).split("/");
      const splitEnd = String(project.EndDate).split("/");
      let temp = {
        refID: project.ProjectID,
        name: pro.ProjectName,
        projectStart: project.StartDate
          ? new Date(Number(split[2]), Number(split[1]) - 1, Number(split[0]))
          : null,
        projectEnd: project.EndDate
          ? new Date(
              Number(splitEnd[2]),
              Number(splitEnd[1]) - 1,
              Number(splitEnd[0])
            )
          : null,
      };
      projectsField.push(temp);
    }
    let avatar = null;
    let pay_via = null;
    try {
      let image = await axios.get(String(user.ProfilePicture), {
        responseType: "arraybuffer",
      });
      avatar = Buffer.from(image.data).toString("base64");
      pay_via = await agencyClient.getEntity(
        tenantID,
        String(user.PaymentPreference)
      );
    } catch (error) {}

    let row = {
      _id: user.rowKey,
      sourceID: 5, // From Old DB
      refID: user.rowKey,
      email: user.UPN,
      firstName: user.FirstName,
      lastName: user.LastName,
      password: "$2b$10$ibtEkifAw1slzuXxHObkDOEs8TD3xS2cDfFF4F4rtIDz1p1gnrXL6",
      telephone: user.Phone,
      personal_email: user.ExternalEmail,
      avatar: `data:image/png;base64,${avatar}`,
      type: user.Core ? "Core Team Member" : "Engineer",
      projectDetail: projectsField,
      // jobTitle: "",
      // jobType: "",
      permission: {
        learning: user.ManageLearningMaps,
        core_team: user.ManageCoreUsers,
        user_project: user.ManageElasticUserAssignments,
        elastic_and_onboard: user.ManageElasticUsers,
        global: user.ManageGlobalSettings,
        projects: user.ManageProjects,
        role_and_skill: user.ManageRolesAndSkills,
        requisitions: user.ManageRequisitions,
      },
      approved: projectsField.length > 0,
      paymentInfo: [{
        paymentDate: user.InitializationDate,
        amount: user.Rate,
        currency: user.RateCurrency,
        frequency: user.RateMetric,
        paymentVia: (
          pay_via ?
          pay_via.AgencyName :
          ""
        ),
      }],
      clearance: {
        bpss: String(user.Clearances).includes("bpss"),
        ctc: String(user.Clearances).includes("ctc"),
        sc: String(user.Clearances).includes("sc"),
        esc: String(user.Clearances).includes("esc"),
        dv: String(user.Clearances).includes("dv"),
        edv: String(user.Clearances).includes("edv"),
      },
      place: {
        location: user.DefaultLocation,
        timezone: user.TimeZone,
        language: user.PreferredLanguage,
      },
      roles,
      skills,
      isActive: true,
      emailApproved: true,
      goals: userGoals,
    };
    data.push(row);
    console.log(row);
    // if(user.UPN == "JOSEPH.MESHACH@DISTRIBUTED.CO")
    // break;
  }
  await userModel.insertMany(data);
  console.log("Importing User Finished!");
}

export async function importProjects() {
  const projectClient = new TableClient(
    `https://${account}.table.core.windows.net`,
    "Project",
    credential
  );
  const projects = projectClient.listEntities();
  let data = [];
  const projectTypes: any = {
    FixedOutcome: "Fixed Outcome",
    ManagedOutcome: "Managed Outcome",
    ManagedProject: "Managed Project",
  };
  for await (const project of projects) {
    let avatar = null;
    if (project.ProjectPicture) {
      try {
        let image = await axios.get(String(project.ProjectPicture), {
          responseType: "arraybuffer",
        });
        avatar = Buffer.from(image.data).toString("base64");
      } catch (error) {}
      console.log(avatar);
    }
    let temp = {
      _id: project.rowKey,
      refID: project.rowKey,
      name: project.ProjectName,
      code: project.ProjectCode,
      type: projectTypes[String(project.ProjectType)],
      description: project.Description,
      logo: `data:image/png;base64,${avatar}`,
    };
    data.push(temp);
  }
  await projectModel.insertMany(data);
  console.log("Project Import FInished");
}

export async function fixDB() {
  try {
    // await userModel.updateMany(
    //   { "payment.currency": "null" },
    //   { "payment.currency": "" }
    // );
    // await userModel.updateMany(
    //   { "payment.per": "null" },
    //   { "payment.per": "" }
    // );
    // await userModel.updateMany(
    //   { "place.location": "null" },
    //   { "place.location": "" }
    // );
    // await userModel.updateMany(
    //   { "place.timezone": "null" },
    //   { "place.timezone": "" }
    // );
    // await userModel.updateMany(
    //   { "place.language": "null" },
    //   { "place.language": "" }
    // );
    await userModel.updateMany({ sourceID: 5 });
    console.log("finished");
  } catch (error) {}
}

export async function importUserXProject() {
  try {
    const client = new TableClient(
      `https://${account}.table.core.windows.net`,
      "UserXProject",
      credential
    );
    const rows = client.listEntities();
    for await (const row of rows) {
      if (row) {
        const user = await userModel.findById(row.partitionKey);
        const project = await projectModel.findById(row.ProjectID);
        if (!user || !project) {
          console.log("skipping ", row.partitionKey);
          continue;
        }
        const check = user.projectDetail.find(
          (d: any) => d.refID === row.projectID
        );
        if (!check) {
          user.projectDetail.push({
            refID: String(row.projectID),
            name: project.name,
            projectStart: getDate(String(row.StartDate)),
            projectEnd: getDate(String(row.EndDate)),
          });
          await user.save();
        }
        const checkProject = project.team.find(
          (d: any) => d.userID === row.partitionKey
        );
        if (!checkProject) {
          //Project Updating.
          project.team.push({
            userID: row?.partitionKey || '',
            email: user.email,
            userType: user.type,
            firstName: user.firstName,
            lastName: user.lastName,
            startDate: getDate(String(row.StartDate)),
            endDate: getDate(String(row.EndDate)),
          });
          await project.save();
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const getDate = (str: string) => {
  if (!str) return null;
  const split = str.split("/");
  return Date.parse(`${split[1]} ${split[0]} ${split[2]}`);
};

export const updateEmails = async () => {
  // const userClient = new TableClient(
  //   `https://${account}.table.core.windows.net`,
  //   "User",
  //   credential
  // );

  // const users = userClient.listEntities();
  // for await (const user of users) {
  //   console.log(user);
  //   const update: TableEntity = {
  //     partitionKey: String(user.partitionKey),
  //     rowKey: String(user.rowKey),
  //     UPN: String(user.UPN) + "M",
  //   };
  //   await userClient.updateEntity(update);
  //   // break;
  // }
  // console.log("azure finished");
  const newUsers = await userModel.find();
  for (const newUser of newUsers) {
    console.log(newUser.email);
    if (newUser.email.includes("DISTRIBUTED.CO")) {
      newUser.email = newUser.email + "M";
      await newUser.save();
    }
  }
  console.log("mongo finished");
};
