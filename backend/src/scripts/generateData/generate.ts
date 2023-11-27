import { Db } from "mongodb";
import {
  rand,
  randUuid,
  randEmail,
  randFirstName,
  randLastName,
  randPassword,
  randPhoneNumber,
  randImg,
  randProductName,
  randProductAdjective,
  randTextRange,
  randPastDate,
  randFutureDate,
  randRecentDate,
  randJobTitle,
  randBoolean,
  randNumber,
  randCurrencyCode,
  randCompanyName,
  randStreetAddress,
  randFlightNumber,
  randTimeZone,
  randLanguage,
  randRole,
  randSkill,
  randUrl,
  randCountryCode,
} from "@ngneat/falso";
import { fillArray, getRandomElements } from "./helpers";
import { exit } from "process";

export type Project = {
  _id: string;
  refID: string;
  name: string;
  code: string;
  type: string;
  logo: string;
  description: string;
};
export type Role = {
  _id: string;
  refID: string;
  name: string;
  description: string;
  parentID: string;
  skills: unknown[];
};
export type Skill = {
  _id: string;
  name: string;
  description: string;
  indexKey: string;
  defaultScope: string;
  parentSkills: unknown[];
  childSkills: unknown[];
  roles: unknown[];
};

export async function createProject() {
  const id = randUuid();
  return {
    _id: id,
    refID: id,
    name: randProductName(),
    code: randProductAdjective(),
    type: rand(["Remote", "Onboard"]),
    logo: randImg(),
    description: randTextRange({ min: 30, max: 50 }),
  };
}

export async function createRole() {
  const id = randUuid();
  return {
    _id: id,
    refID: id,
    name: randRole(),
    description: randTextRange({ min: 30, max: 50 }),
    parentID: "",
    skills: [],
  };
}

export async function createSkill() {
  const id = randUuid();
  return {
    _id: id,
    name: randSkill(),
    description: randTextRange({ min: 30, max: 50 }),
    indexKey: id,
    defaultScope: rand([
      "Role Specific",
      "Sector Specific",
      "Cross Sector",
      "Global Scope",
    ]),
    parentSkills: [],
    childSkills: [],
    roles: [],
  };
}

export async function createUser(
  projects: Project[],
  roles: Role[],
  skills: Skill[]
) {
  const id = randUuid();
  const paymentInfo = [];
  for (let j = 0; j < randNumber({ min: 1, max: 5 }); j++) {
    paymentInfo.push({
      paymentDate: randPastDate(),
      amount: randNumber({ min: 50, max: 800 }),
      frequency: rand(["Day", "Hour"]),
      currency: randCurrencyCode(),
      paymentVia: rand(["Direct", "AEJ", "Barclay Search", "Triology"]),
    });
  }
  return {
    _id: id,
    refID: id,
    email: randEmail(),
    firstName: randFirstName(),
    lastName: randLastName(),
    password: randPassword(),
    telephone: randPhoneNumber(),
    personal_email: randEmail(),
    avatar: randImg(),
    type: rand(["Core Team Member", "Engineer", "Client"]),
    projectDetail: getRandomElements(projects, 2, 10).map((project) => ({
      ...project,
      projectStart: randPastDate(),
      projectEnd: rand([randRecentDate(), randFutureDate()]),
      projectType: project.type,
      proposition: rand([
        "Monitored Outcome",
        "Managed Outcome",
        "Fixed Outcome",
        "Partner Framework",
      ]),
    })),
    jobTitle: randJobTitle(),
    jobType: rand([
      "Full-Time",
      "Part-Time",
      "Contract",
      "Temporary",
      "Internship",
      "None",
    ]),
    notes: [
      { createdAt: randPastDate(), note: randTextRange({ min: 10, max: 50 }) },
    ],
    permission: {
      learning: randBoolean(),
      core_team: randBoolean(),
      user_project: randBoolean(),
      elastic_and_onboard: randBoolean(),
      global: randBoolean(),
      projects: randBoolean(),
      role_and_skill: randBoolean(),
      requisitions: randBoolean(),
    },
    approved: randBoolean(),
    paymentInfo,
    budget: {
      rate: randNumber({ min: 1000, max: 2000 }),
      per: rand(["Day", "Hour"]),
      currency: randCurrencyCode(),
    },
    hasOwnCompany: randBoolean(),
    companyDetails: {
      name: randCompanyName(),
      address: randStreetAddress(),
      phone: randPhoneNumber(),
      VAT: randFlightNumber(),
      companyId: randFlightNumber(),
    },
    clearance: {
      bpss: randBoolean(),
      ctc: randBoolean(),
      sc: randBoolean(),
      esc: randBoolean(),
      dv: randBoolean(),
      edv: randBoolean(),
    },
    place: {
      location: randStreetAddress(),
      timezone: randTimeZone(),
      language: randLanguage(),
    },
    roles: getRandomElements(roles, 5, 10).map((role) => ({
      ...role,
      startDate: randPastDate(),
      endDate: rand([randRecentDate(), randFutureDate()]),
    })),
    skills: getRandomElements(skills, 5, 10).map((skill) => ({
      ...skill,
      level: randNumber({ min: 0, max: 10 }),
      claimDate: randPastDate(),
      approved: randBoolean(),
      approvedBy: id,
    })),
    goals: [],
    files: [],
    isActive: randBoolean(),
    createdAt: randPastDate(),
    createdBy: id,
    updatedAt: randRecentDate(),
    updatedBy: id,

    // candidates
    connected: randBoolean(),
    teamTailorLink: randUrl(),
    facebookProfile: randUrl(),
    linkedinProfile: randUrl(),
    unsubscribed: randBoolean(),
    sourced: randBoolean(),
    referred: randBoolean(),
    referringSite: randUrl(),
    originalResume: randUrl(),
    picture: randImg(),
    availablity: randFutureDate(),
  };
}

export async function createExternalUser(roles: Role[], skills: Skill[]) {
  const id = randUuid();
  return {
    _id: id,
    email: randEmail(),
    firstName: randFirstName(),
    lastName: randLastName(),
    availablity: randFutureDate(),
    roles: getRandomElements(roles, 1, 2).map((role) => ({
      refID: role._id,
      name: role.name,
    })),
    skills: getRandomElements(skills, 1, 2).map((skill) => ({
      refID: skill._id,
      name: skill.name,
    })),
    location: randCountryCode(),
    createdAt: randPastDate(),
    __v: 0,
  };
}

export async function generate(db: Db) {
  const projects = await fillArray(200, () => createProject());
  const roles = await fillArray(100, () => createRole());
  const skills = await fillArray(500, () => createSkill());
  const users = await fillArray(50, () => createUser(projects, roles, skills));
  const externalUsers = await fillArray(50, () =>
    createExternalUser(roles, skills)
  );

  // Reason for 'as any[]' is because `_id` is setup as a string not ObjectId
  await db.collection("projects").insertMany(projects as any[], {
    forceServerObjectId: true,
  });
  await db.collection("roles").insertMany(roles as any[], {
    forceServerObjectId: true,
  });
  await db.collection("skills").insertMany(skills as any[], {
    forceServerObjectId: true,
  });
  await db.collection("users").insertMany(users as any[], {
    forceServerObjectId: true,
  });
  await db.collection("external_users").insertMany(externalUsers as any[], {
    forceServerObjectId: true,
  });

  exit(0);
}
