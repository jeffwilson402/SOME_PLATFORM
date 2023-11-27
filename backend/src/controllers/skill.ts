import { Request, Response } from "express";
import Skill from "../models/skill";
import { v4 as uuidv4 } from "uuid";
const skillController = {
  all: async (req: Request, res: Response) => {
    const { searchKey, perPage, currentPage, fields } = req.body;
    let options = {};
    let selection: any = {};
    if (searchKey) {
      options = { name: { $regex: searchKey, $options: "i" } };
    }
    if (fields) {
      fields.map((f: string) => {
        selection[f] = 1;
      });
    }
    const data = await Skill.find(options, selection)
      .skip(currentPage * perPage)
      .limit(perPage);
    const count = await Skill.find(options).count();
    res.send({ data, count });
  },
  getOptions: async (req: Request, res: Response) => {
    try {
      const { searchKey } = req.body;
      let options = {};
      let selection: any = {};
      if (searchKey) {
        options = { name: { $regex: searchKey, $options: "i" } };
      }
      const data = await Skill.find(options);
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  },
  save: async (req: Request, res: Response) => {
    try {
      const skill = req.body;
      if (!skill._id) {
        const check = await Skill.findOne({ name: skill.name });
        if (check)
          return res.status(400).send({ message: "The Skill Already Exists!" });
        skill._id = uuidv4();
        await Skill.create(skill);
      } else {
        await Skill.findByIdAndUpdate(skill._id, skill);
      }
      res.send({ message: "ok" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something Went Wrong!" });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      await Skill.findByIdAndDelete(_id);
      res.send({ message: "ok" });
    } catch (error) {
      res.send({ message: "Something Went Wrong!" });
    }
  },

  //EndPoints
  allForEndpoints: async (req: Request, res: Response) => {
    let { searchKey, perPage, currentPage } = req.query;
    let options = {};
    console.log(perPage, currentPage, req.query);
    let selection: any = {};
    if (searchKey) {
      options = { name: { $regex: searchKey, $options: "i" } };
    }
    const data = await Skill.find(options)
      .skip(Number(currentPage) * Number(perPage))
      .limit(Number(perPage));
    const count = await Skill.find(options).count();
    res.send({ data, count });
  },
  getById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const skill = await Skill.findById(id).lean();
      res.send(skill);
    } catch (error) {
      res.status(500).send("Internal Server Error!");
    }
  },
};

export default skillController;
