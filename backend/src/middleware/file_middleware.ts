import { Request, Response, NextFunction } from "express";
import { createReadStream, readFileSync, writeFileSync } from "fs";
import mongoose, { ConnectOptions } from "mongoose";
import { getMongoUrl } from "../db";
const secret: string = process.env.JWT_SECRET || "TOPSECRET";
const file_middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename, filedata } = req.body;
    writeFileSync(filename, filedata, { encoding: "base64" });
    const file = readFileSync(filename);
    const mongoUrl = await getMongoUrl();
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true, // default recommended options
      useUnifiedTopology: true,
    } as ConnectOptions);
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    // next();
    createReadStream(filename).
     pipe(gfs.openUploadStream(filename));
    res.send();
  } catch (error) {
    console.log(error);
  }
};

export default file_middleware;
