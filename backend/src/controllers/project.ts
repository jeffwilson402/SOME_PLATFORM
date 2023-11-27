import { Request, Response } from "express";
import { existsSync, unlinkSync } from "fs";
import { getMongoUrl } from '../db';
import Project from "../models/project";
import User from "../models/user";
import { buildFields } from "../utils";
import mongoose, { ConnectOptions } from "mongoose";
import Grid from "gridfs-stream";
import { v4 as uuidv4 } from "uuid";
import { GridFsStorage } from "multer-gridfs-storage";

const projectController = {
  all: async (req: Request, res: Response) => {
    try {
      const { fields } = req.body;
      const selection = buildFields(fields);
      const projects = await Project.find({}, selection);
      return res.send(projects);
    } catch (error: any) {
      console.log(error);
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      const project = await Project.findById(_id);
      res.send(project);
    } catch (error) {
      console.log(error);
    }
  },
  save: async (req: Request, res: Response) => {
    try {
      const project = req.body;
      if (!project._id) {
        // Creating
        const check = await Project.findOne({
          $or: [{ name: project.name }, { code: project.code }],
        }).exec();
        if (check) {
          return res.status(400).send({
            message: "The project with this name or code already exists!",
          });
        }
        project.refID = uuidv4();
        project._id = uuidv4();
        await Project.create(project);
      } else {
        await Project.findByIdAndUpdate(project._id, project);
      }
      return res.send({ message: "ok" });
    } catch (error: any) {
      res.status(500).send({ message: "Something Went Wrong!" });
      console.log(error);
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
          // gfs.collection("uploads");
          const _id = new mongoose.Types.ObjectId(file_id);
          gfs.find({ _id }).toArray((err, files) => {
            if (!files || files.length === 0)
              return res.status(400).send("no files exist");
            console.log(files[0]);
            gfs.openDownloadStream(_id).pipe(res);
          });
          gfs.openDownloadStream(_id).pipe(res);
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  fileUpload: async (req: Request, res: Response) => {
    try {
      const { _id } = req.body;
      console.log(req.file);
      const fileInfo: any = req.file;
      // req.body.file = req.files;
      // const file = req.body.file.file;
      // const file_name = `${new Date().getTime()}_${file.name}`;
      // const path = `./uploads/project/${file_name}`;
      // await file.mv(path);
      await Project.findByIdAndUpdate(_id, {
        $addToSet: {
          documents: [
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
      console.log(error);
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      await Project.findByIdAndDelete(_id);
      return res.send({ message: "ok" });
    } catch (error) {
      res.status(500).send({ message: "Something Went Wrong!" });
    }
  },
  deleteDocument: async (req: Request, res: Response) => {
    try {
      const { _id, doc_id } = req.body;
      console.log(doc_id);
      const project = await Project.findById(_id);
      if (!project) throw new Error("Project Not Found");
      const document = project.documents.find((d: any) => d._id == doc_id);
      // if (existsSync(`./uploads/project/${document.file_name}`))
      //   unlinkSync(`./uploads/project/${document.file_name}`);
      const temp = project.documents.filter((p: any) => p.file_id != doc_id);
      project.documents = temp;
      await project.save();
      const mongoUrl = await getMongoUrl();
      await mongoose.connect(mongoUrl, {
        useNewUrlParser: true, // default recommended options
        useUnifiedTopology: true,
      } as ConnectOptions);
      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });
      gfs.delete(new mongoose.Types.ObjectId(doc_id));
      res.send(project);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something Went Wrong!" });
    }
  },
  addMemberToTeam: async (req: Request, res: Response) => {
    try {
      const { user_id, project_id } = req.body;
      const user = await User.findById(user_id);
      const project = await Project.findById(project_id);
      if (!user || !project) throw new Error("Data Not Found");
      const member = {
        userID: user._id,
        email: user.email,
        userType: user.type,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      console.log(member);
      const teamCheck = project.team.find(
        (member: any) => member.userID === user_id
      );
      if (!teamCheck) {
        project.team.push(member);
        await project.save();
        const projectDetail = {
          refID: project._id,
          name: project.name,
        };
        user.projectDetail.push(projectDetail);
        await user.save();
        res.send(member);
      } else {
        res
          .status(400)
          .send({ message: "This Member Already Exists in the team!" });
      }
    } catch (error) {}
  },
  deleteTeamMember: async (req: Request, res: Response) => {
    const { user_id, project_id } = req.body;
    try {
      const user = await User.findById(user_id);
      const project = await Project.findById(project_id);
      if (!user || !project) throw new Error("Data Not Found");
      const filteredMembers = project.team.filter(
        (member: any) => member.userID !== user_id
      );
      project.team = filteredMembers;
      await project.save();
      const filteredProjects = user.projectDetail.filter(
        (project: any) => project.refID !== project_id
      );
      user.projectDetail = filteredProjects;
      await user.save();
      res.send({ message: "ok" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  saveTeamMember: async (req: Request, res: Response) => {
    const { user_id, project_id, startDate, endDate } = req.body;
    try {
      const user = await User.findById(user_id);
      const project = await Project.findById(project_id);
      if (!user || !project) throw new Error("Data Not Found");
      project.team = project.team.map((member: any) => {
        if (member.userID === user_id) {
          member.startDate = startDate;
          member.endDate = endDate;
          return member;
        } else return member;
      });
      await project.save();
      user.projectDetail = user.projectDetail.map((project: any) => {
        if (project.refID === project_id) {
          project.projectStart = startDate;
          project.projectEnd = endDate;
          return project;
        } else return project;
      });
      await user.save();
      res.send({ message: "ok" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
};

export default projectController;
