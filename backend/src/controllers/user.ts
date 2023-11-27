import { Request, Response } from "express";
import User from "../models/user";
import Project from "../models/project";
import Skill from "../models/skill";
import Role from "../models/role";
import SchemaSkill from "../models/schema_skill";
import bcrypt from "bcrypt";
import _ from "lodash";
import jwt from "jsonwebtoken";
import {
  convertUserToModel,
  convertModelToUser,
  buildFields,
  validateEmail,
  getFileExtension,
  mbToBytes,
} from "../utils";
import {
  createReadStream,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import "cross-fetch/polyfill";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { v4 as uuidv4 } from "uuid";
import mongoose, {
  ConnectOptions,
  FilterQuery,
  SortOrder,
  UpdateQuery,
} from "mongoose";
import { getMongoUrl } from "../db";
import { fileSizeLimit, FileTypes, UserTypes } from "../constants/enum";
import projectModel from "../models/project";
import externalUserModel, {
  ExternalUser,
  ExternalUserUnit,
} from "../models/external_user";
import path from "path";
import { environment } from "../environment";
import {
  CodilityService,
  CodilitySession,
  CodilitySessionResult,
} from "../services/codility.service";
import { EmailService } from "../services/email.service";

export type SaveUserForExternalRequest = {
  email: string;
  firstName: string;
  lastName: string;
  availablity: string;
  skills: string[];
  roles: string[];
  place: {
    location: string;
  };
};
import {
  ISelectInput,
  IUnit,
  IUser,
  IUserSkill,
} from "../constants/interfaces";

const secret = process.env.JWT_SECRET || "TOPSECRET";
const userController = {
  signin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send({ message: "No Such User!" });
      const check = bcrypt.compareSync(password, user.password);
      if (check) {
        const token = jwt.sign(
          {
            _id: user._id,
            refID: user.refID,
            email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          secret,
          { expiresIn: "24h" }
        );
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
        res.send({
          _id: user._id,
          refID: user.refID,
          email,
          firstName: user.firstName,
          lastName: user.lastName,
          permission: user.permission,
          type: user.type,
          token,
        });
      }
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong!" });
    }
  },
  verifyEmail: async (req: Request, res: Response) => {
    const { token } = req.body;
    jwt.verify(token, secret, async function (err: any, data: any) {
      if (err) return res.status(400).send({ message: "unauthorized" });
      const user = await User.findOne({ email: data.email });
      if (user) {
        user.emailApproved = true;
        await user.save();
        res.send({ message: "ok" });
      } else {
        res.send({ message: "This link is not valid." });
      }
    });
  },
  signup: async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    const checkEmail = await User.findOne({ email });
    if (checkEmail)
      return res
        .status(400)
        .send({ message: "Your Email has already been used!" });
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 10),
    });
  },
  allCoreTeam: async (req: Request, res: Response) => {
    try {
      const { searchKey, currentPage, perPage } = req.body;
      const data = await User.find({
        type: "Core Team Member",
        $or: [
          { firstName: { $regex: searchKey, $options: "i" } },
          { lastName: { $regex: searchKey, $options: "i" } },
          { email: { $regex: searchKey, $options: "i" } },
        ],
      })
        .populate("projectDetail.refID", "_id name")
        .populate("skills", "_id name")
        .skip(currentPage * perPage)
        .limit(perPage);
      const count = await User.find({
        type: "Core Team Member",
        firstName: { $regex: searchKey, $options: "i" },
        lastName: { $regex: searchKey, $options: "i" },
        email: { $regex: searchKey, $options: "i" },
      }).count();
      res.send({ data, count });
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong!" });
    }
  },
  allEngineers: async (req: Request, res: Response) => {
    try {
      const {
        name,
        skills,
        locations,
        projects,
        agencies,
        clearances,
        languages,
        approval,
        sourceIds,
      } = req.body;
      let query: FilterQuery<IUser> = {
        type: "Engineer",
        $or: [
          { firstName: { $regex: name, $options: "i" } },
          { lastName: { $regex: name, $options: "i" } },
        ],
      };
      if (projects.length) {
        const projectIds = projects.map((project: ISelectInput) => project._id);
        query = {
          ...query,
          "projectDetail.refID": { $in: projectIds },
        };
      }
      if (clearances.length) {
        let clearance_query: { [key: string]: boolean } = {};
        clearances.forEach((c: { key: string }) => {
          clearance_query[`clearance.${c.key}`] = true;
        });
        query = {
          ...query,
          ...clearance_query,
        };
      }
      if (skills.length) {
        const skillIds = skills.map((skill: ISelectInput) => skill._id);
        query = {
          ...query,
          "skills.refID": { $all: skillIds },
        };
      }
      if (locations.length) {
        query = {
          ...query,
          "place.location": { $in: locations },
        };
      }
      if (agencies.length) {
        query = {
          ...query,
          "paymentInfo.paymentVia": { $in: agencies },
        };
      }
      if (languages.length) {
        query = {
          ...query,
          "place.language": { $in: languages },
        };
      }
      if (approval.length) {
        const approval_values = approval.map(
          (a: { label: string; value: string }) => a.value
        );
        query = {
          ...query,
          approved: { $in: approval_values },
        };
      }
      if (sourceIds.length) {
        query = {
          ...query,
          sourceID: { $in: sourceIds },
        };
      }
      const allEngineers = await User.find(query)
        .populate("projectDetail.refID", "_id name")
        .populate("skills", "_id name");
      return res.send(allEngineers);
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong!" });
    }
  },
  getFinancials: async (req: Request, res: Response) => {
    try {
      const { searchKey, perPage, currentPage } = req.body;
      const selection = buildFields(["email", "projectDetail", "paymentInfo"]);
      const data = await User.find(
        { type: "Engineer", email: { $regex: searchKey, $options: "i" } },
        selection
      )
        .populate({
          path: "projectDetail.refID",
          match: {
            "projectDetail.refID": { $ne: "" },
          },
        })
        .skip(currentPage * perPage)
        .limit(perPage)
        .lean();
      const processed = data.map((d) => {
        let project_desc: string = "";
        const detail = d.projectDetail;
        if (detail?.length) {
          for (let i = 0; i < detail.length; i++) {
            project_desc +=
              detail[i].name +
              " (" +
              (detail[i].projectStart
                ? // @ts-ignore
                  detail[i].projectStart?.toISOString().split("T")[0]
                : "~") +
              " To " +
              (detail[i].projectEnd
                ? // @ts-ignore
                  detail[i].projectEnd?.toISOString().split("T")[0] + ") "
                : "~)") +
              ", ";
          }
        }
        const payment = d.paymentInfo?.sort(
          (a, b) => a.paymentDate.getTime() - b.paymentDate.getTime()
        )[0];
        return {
          ...d,
          project_desc: project_desc.substring(0, project_desc.length - 2),
          payment,
        };
      });
      const count = await User.find({
        type: "Engineer",
        email: { $regex: searchKey, $options: "i" },
      }).count();
      res.send({ data: processed, count });
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong!" });
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      const user = await User.findById(_id).populate(
        "projectDetail.refID",
        "_id name"
      );
      const flattened = convertModelToUser(user);
      res.send(flattened);
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong!" });
    }
  },
  updateProfile: async (req: Request, res: Response) => {
    try {
      const { user, userData } = req.body;
      let userRecord = await User.findById(user._id);
      if (!userRecord) throw new Error("User Not Found");
      let password_check = true;
      if (userData.password)
        password_check = bcrypt.compareSync(
          userData.password,
          userRecord.password
        );
      if (!password_check)
        return res
          .status(400)
          .send({ message: "The Current Password is Incorrect!" });
      await User.findByIdAndUpdate(user._id, {
        ...userData,
        password: user.new_password
          ? bcrypt.hashSync(userData.new_password, 10)
          : userRecord.password,
      });
      res.send();
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const { member } = req.body;
      member.distributed_email += "@distributed.co";
      const check = await User.findOne({
        distributed_email: member.distributed_email,
      }).exec();
      if (check) {
        return res
          .status(400)
          .send({ message: "The Distributed Email Already Exists!" });
      }
      await User.create(member);
      return res.send({ message: "ok" });
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong!" });
    }
  },
  save: async (req: Request, res: Response) => {
    try {
      let values = req.body;
      const { user } = req.body;
      if (!values._id) {
        // Creating A New User
        const check = await User.findOne({ email: values.email });
        if (check)
          return res.status(400).send({
            message: "This Email Address Already Exists For Some User!",
          });
        let modelData = convertUserToModel(values, user);
        modelData.password = bcrypt.hashSync("1234", 10);
        modelData._id = uuidv4();
        modelData.refID = modelData._id;
        await User.create(modelData);
        const token = jwt.sign(
          {
            _id: modelData._id,
            email: values.email,
          },
          secret,
          { expiresIn: "1h" }
        );
      } else {
        let modelData = convertUserToModel(values, user);
        delete modelData.notes;
        let toUpdateNote: UpdateQuery<IUser> = {};
        if (values.note) {
          toUpdateNote = {
            $addToSet: { notes: { note: values.note.toString() } },
          };
        }
        const updated = await User.findByIdAndUpdate(
          values._id,
          {
            ...modelData,
            ...toUpdateNote,
          },
          { new: true }
        );
        const updatedUser = convertModelToUser(updated);
        return res.send({ message: "ok", updatedUser });
      }
      res.send({ message: "ok" });
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong" });
    }
  },
  savePermission: async (req: Request, res: Response) => {
    try {
      const { _id, permission } = req.body;
      const user = await User.findById(_id);
      if (!user) throw new Error("User Not Found");
      user.permission = permission;
      await user.save();
      res.send({ message: "Ok" });
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong" });
    }
  },
  assignProjects: async (req: Request, res: Response) => {
    try {
      const { _id, projects } = req.body;
      const user = await User.findById(_id);
      if (!user) throw new Error("User Not Found");
      const prevProjects = user.projectDetail.map((p) => p.refID);
      const currentProjects = projects.map((p: ISelectInput) => p._id);
      const toAdd = _.difference(currentProjects, prevProjects);
      const toRemove = _.difference(prevProjects, currentProjects);
      //Updating User
      const projectDetail = projects.map((project: ISelectInput) => ({
        refID: project._id,
        name: project.name,
      }));
      user.projectDetail = projectDetail;
      await user.save();
      //Updating Projects
      //Adding this user to the projects.
      for (let i = 0; i < toAdd.length; i++) {
        const project = await Project.findById(toAdd[i]);
        if (!project) throw new Error("Project Not Found");
        project.team.push({
          userID: _id,
          email: user.email,
          userType: user.type,
          firstName: user.firstName,
          lastName: user.lastName,
        });
        await project.save();
      }
      //Removing this user from the projects.
      for (let i = 0; i < toRemove.length; i++) {
        const project = await Project.findById(toRemove[i]);
        if (!project) throw new Error("Project Not Found");
        project.team = project.team.filter(
          (member) => member.userID !== user._id
        );
        await project.save();
      }
      res.send({ message: "ok" });
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong" });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      const projects = await projectModel.find({ "team.userID": _id });
      //Deleting User From Project Team....
      for (let i = 0; i < projects.length; i++) {
        projects[i].team = projects[i].team.filter(
          (user) => user.userID !== _id
        );
        await projects[i].save();
      }
      await User.findByIdAndDelete(_id);
      res.send({ message: "ok" });
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong" });
    }
  },
  fileUpload: async (req: Request, res: Response) => {
    try {
      const { _id } = req.body;
      const fileInfo: any = req.file;
      await User.findByIdAndUpdate(_id, {
        $addToSet: {
          files: [
            {
              file_id: fileInfo.id,
              file_name: fileInfo.filename,
              uploadedAt: fileInfo.updatedDate,
            },
          ],
        },
      });
      res.send({ message: "ok" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  fileDownload: async (req: Request, res: Response) => {
    try {
      const { file_id } = req.body;
      const mongoUrl = await getMongoUrl();
      await mongoose
        .connect(mongoUrl, {
          useNewUrlParser: true, // default recommended options
          useUnifiedTopology: true,
        } as ConnectOptions)
        .then(async () => {
          const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads",
          });
          const _id = new mongoose.Types.ObjectId(file_id);
          gfs.find({ _id }).toArray((err, files) => {
            if (!files || files.length === 0)
              return res.status(400).send("no files exist");
            gfs.openDownloadStream(_id).pipe(res);
          });
          gfs.openDownloadStream(_id).pipe(res);
        });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  deleteDocument: async (req: Request, res: Response) => {
    try {
      const { _id, doc_id } = req.body;
      const user = await User.findById(_id);
      if (!user) throw new Error("Project Not Found");
      user.files = user.files?.filter((p) => p.file_id != doc_id);
      await user.save();
      const mongoUrl = await getMongoUrl();
      await mongoose.connect(mongoUrl, {
        useNewUrlParser: true, // default recommended options
        useUnifiedTopology: true,
      } as ConnectOptions);
      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });
      gfs.delete(new mongoose.Types.ObjectId(doc_id));
      res.send(user);
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong!" });
    }
  },
  createCandidate: async (req: Request, res: Response) => {
    try {
      const _id = uuidv4();
      const { picture, email } = req.body;
      const validEmail = validateEmail(email);
      if (!validEmail)
        return res
          .status(400)
          .send({ message: "The email addres is not valid" });
      const check = await User.findOne({ email });
      if (check)
        return res
          .status(400)
          .send({ message: "This email already exists in users" });
      const toInsert = { ...req.body, picture, refID: _id };
      const result = await User.create({
        _id,
        type: UserTypes.ENGINEER,
        ...toInsert,
      });
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  saveCandidateFiles: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.params;
      const files = req.body;
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(400).send({ message: "No Such User!" });
      }
      const mongoUrl = await getMongoUrl();
      await mongoose.connect(mongoUrl, {
        useNewUrlParser: true, // default recommended options
        useUnifiedTopology: true,
      } as ConnectOptions);
      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });
      for (let i = 0; i < files.length; i++) {
        const filename = files[i].filename;
        const filedata = files[i].filedata;
        const extension = getFileExtension(filename);
        if (!(extension in FileTypes)) {
          const fileTypeValues = Object.values(FileTypes);
          const extensions = fileTypeValues
            .slice(0, fileTypeValues.length / 2)
            .join(", ");
          return res.status(400).send({
            message: `We accept the following files ${extensions}for upload.`,
          });
        }
        const tempPath = path.resolve(__dirname, `../temp/${filename}`);
        writeFileSync(tempPath, filedata, { encoding: "base64" });
        const fileInfo = statSync(tempPath);
        if (fileInfo.size > mbToBytes(fileSizeLimit))
          return res.status(413).send({
            message: `File Too Large, The File Size should be limited to ${fileSizeLimit}MB.`,
          });
        const uploadStream = gfs.openUploadStream(tempPath);
        createReadStream(tempPath).pipe(uploadStream);
        user.files.push({
          file_id: String(uploadStream.id),
          file_name: filename,
        });
      }
      await user.save();
      readdirSync(path.resolve(__dirname, `../temp`)).forEach((f) =>
        unlinkSync(path.resolve(__dirname, `../temp/${f}`))
      );
      res.send({ message: "File Saved Successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  getSkillsById: async (req: Request, res: Response) => {
    const { _id } = req.params;
    try {
      const user = await User.findById(_id).populate(
        "skills.approvedBy",
        "_id email"
      );
      if (!user) throw new Error("User Not Found!");
      res.send({ skills: user.skills, email: user.email });
    } catch (error) {}
  },
  getRolesById: async (req: Request, res: Response) => {
    const { _id } = req.params;
    try {
      const user = await User.findById(_id);
      if (!user) throw new Error();
      res.send({ roles: user.roles, email: user.email });
    } catch (error) {}
  },
  addSkill: async (req: Request, res: Response) => {
    try {
      const { skill, level, _id, approvedBy } = req.body;
      const skillData = await SchemaSkill.findOne({ refID: skill.refID });
      if (!skillData) throw new Error("Skill Data Not Found!");
      await User.findByIdAndUpdate(_id, {
        $addToSet: {
          skills: {
            refID: skill.refID,
            indexKey: skillData.indexKey,
            approvedBy,
            approved: true,
            level,
            name: skill.name,
            claimDate: new Date(),
          },
        },
      });
      res.send({ message: "Ok" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  saveSkill: async (req: Request, res: Response) => {
    try {
      const { skill, _id } = req.body;
      const user = await User.findById(_id);
      if (!user) throw new Error("User Not Found");
      const temp = user.skills.map((s) => {
        if (s.refID == skill.refID) {
          return {
            ...s,
            level: skill.level,
          };
        } else return s;
      });
      user.skills = temp;
      await user.save();
      res.send({ message: "ok" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  addRole: async (req: Request, res: Response) => {
    const { _id, role, startDate, endDate } = req.body;
    try {
      const check = await User.findById(_id);
      if (!check) throw new Error("User Not Found");
      const found = check.roles.find((r) => r.refID == role._id);
      if (found)
        return res
          .status(400)
          .send({ message: "The User has already this role!" });
      await User.findByIdAndUpdate(_id, {
        $push: {
          roles: {
            refID: role._id,
            name: role.name,
            startDate,
            endDate,
          },
        },
      });
      const goals = role.skills.map((skill: IUserSkill) => ({
        skillID: skill.refID,
        name: skill.name,
      }));
      await User.findByIdAndUpdate(_id, {
        $push: {
          goals,
        },
      });
      const user = await User.findById(_id);
      if (!user) throw new Error("User Not Found");
      res.send(user.roles);
    } catch (error) {}
  },
  getUserOptions: async (req: Request, res: Response) => {
    try {
      const coreUsers = await User.find({ type: UserTypes.CORE }, "_id email");
      const elasticUsers = await User.find(
        { type: UserTypes.ENGINEER },
        "_id email"
      );
      res.send({ coreUsers, elasticUsers });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  endPointSignIn: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_USER_POOL_ID || "",
      ClientId: process.env.AWS_CLIENT_ID || "",
    });
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session, userConfirmationNecessary) => {
        if (userConfirmationNecessary) {
          return res.status(403).send({ message: "User Not Confirmed Yet." });
        }

        return res.send({
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      },
      onFailure: (err) => {
        res.status(500).send({ message: "Internal Server Error!", error: err });
      },
    });
  },
  saveUserForExternal: async (req: Request, res: Response) => {
    const values: SaveUserForExternalRequest = req.body;
    try {
      const checkEmail = await externalUserModel.findOne({
        email: values.email,
      });
      if (checkEmail)
        return res.status(400).send({ message: "This Email is duplicated!" });
      let errors: string[] = [];
      let skills: ExternalUserUnit[] = [];
      let roles: ExternalUserUnit[] = [];
      for (const skill_id of values.skills) {
        const skill = await Skill.findById(skill_id);
        if (!skill) {
          errors.push(`The skill with id:${skill_id} doesn't exist`);
          continue;
        }
        skills.push({ refID: skill_id, name: skill.name });
      }
      for (const role_id of values.roles) {
        const role = await Role.findById(role_id);
        if (!role) {
          errors.push(`The role with id:${role_id} doesn't exist`);
          continue;
        }
        roles.push({ refID: role_id, name: role.name });
      }
      const external_user = await externalUserModel.create({
        _id: uuidv4(),
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        availablity: new Date(Date.parse(values.availablity)),
        skills,
        roles,
        location: values.place.location ?? "",
      });
      await external_user.save();
      res.send({
        user: external_user,
        errors,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error!", error });
    }
  },
  getExternalUsers: async (req: Request, res: Response) => {
    const {
      sort,
      limit,
      page,
      name,
      email,
      location,
      skills,
      roles,
      availablityAfter,
      availablityBefore,
    } = req.query as Record<string, string>;

    // setup filters
    const filter: FilterQuery<ExternalUser> = {};
    if (name) {
      filter.$or = [
        { firstName: new RegExp(name, "i") },
        { lastName: new RegExp(name, "i") },
      ];
    }
    if (email) {
      filter["email"] = new RegExp(email, "i");
    }
    if (location) {
      filter["location"] = new RegExp(location, "i");
    }
    if (skills) {
      filter["skills.name"] = new RegExp(skills, "i");
    }
    if (roles) {
      filter["roles.name"] = new RegExp(roles, "i");
    }
    if (availablityAfter || availablityBefore) {
      filter["availablity"] = {};
      filter["availablity"]["$gte"] = new Date(Date.parse(availablityAfter));
      filter["availablity"]["$lte"] = new Date(Date.parse(availablityBefore));
    }

    // setup pagination
    const limitN = Number.parseInt(limit) ?? 10;
    const pageN = Number.parseInt(page) ?? 0;

    // setup sorting
    const sortObj: {
      [key: string]: SortOrder;
    } = {};
    if (sort) {
      if (sort[0] === "+") {
        sortObj[sort.substring(1)] = 1;
      } else if (sort[0] === "-") {
        sortObj[sort.substring(1)] = -1;
      }
    }

    try {
      const users = await externalUserModel
        .find(filter)
        .sort(sortObj)
        .limit(limitN)
        .skip(pageN * limitN)
        .lean({ default: true })
        .exec();
      const count = await externalUserModel.countDocuments();
      res.send({
        users,
        total: count,
      });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  getExternalUser: async (req: Request, res: Response) => {
    const { id } = req.query as Record<string, string>;
    try {
      const user = await externalUserModel.findOne({ _id: id });
      if (!user) {
        return res.status(400).send({ message: "no user found" });
      }

      const evaluations = [];
      const codility = new CodilityService(
        environment.SYPHON_CODILITY_HOST ?? "",
        environment.SYPHON_CODILITY_TOKEN ?? ""
      );
      const sessions = await codility.getSessions(user.email);
      if (sessions) {
        const sessionResultTasks: Promise<{
          session: CodilitySession;
          result: CodilitySessionResult | null;
        }>[] = [];
        for (const session of sessions) {
          sessionResultTasks.push(
            new Promise(async (resolve) => {
              const result = await codility.getSessionResult(session.id);
              resolve({
                session,
                result,
              });
            })
          );
        }
        const sessionResults = await Promise.all(sessionResultTasks);
        for (const result of sessionResults) {
          if (!result || !result.result) continue;
          evaluations.push({
            ...result.result.evaluation,
            name: result.session.testName,
            start_date: result.session.start_date,
            close_date: result.session.close_date,
          });
        }
      }

      res.send({
        user,
        evaluations,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  getCodilityTests: async (req: Request, res: Response) => {
    const codility = new CodilityService(
      environment.SYPHON_CODILITY_HOST ?? "",
      environment.SYPHON_CODILITY_TOKEN ?? ""
    );
    const tests = await codility.getTests();
    res.status(200).send(tests);
  },
  sendCodilityTest: async (req: Request, res: Response) => {
    const { test, email } = req.query as Record<string, string>;
    if (!test || !email) {
      return res.status(400).send({ message: "invalid requet" });
    }

    const user = await externalUserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }

    // create test session
    const codility = new CodilityService(
      environment.SYPHON_CODILITY_HOST ?? "",
      environment.SYPHON_CODILITY_TOKEN ?? ""
    );
    const session = await codility.createTestSession(
      test,
      email,
      user.firstName,
      user.lastName
    );
    if (!session) {
      return res.status(400).send({
        message: "failed to create codility test session",
      });
    }

    // send email
    const emailService = new EmailService(
      environment.SYPHON_EMAIL_HOST ?? "",
      environment.SYPHON_EMAIL_TOKEN ?? "",
      environment.SYPHON_EMAIL_FROM ?? ""
    );
    const isEmailSent = await emailService.sendEmail(
      `${user.firstName} ${user.lastName}`,
      email,
      "Codility Test",
      JSON.stringify(session),
      JSON.stringify(session)
    );
    if (!isEmailSent) {
      return res
        .status(500)
        .send({ message: "failed to send codility test email to user" });
    }

    return res.status(200).send({ message: "done" });
  },
};

export default userController;
