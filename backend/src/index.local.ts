import { APIGatewayEvent, Context } from "aws-lambda";
import express, { Application, Request } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";

import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import mongoose, { ConnectOptions } from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import { getFileExtension } from "./utils";
import multer from "multer";
import Grid from "gridfs-stream";
import { fileSizeLimit, FileTypes } from "./constants/enum";
import routes from "./routes";


const app: Application = express();

/* Loading Environment File For Running Mode */
dotenv.config();

const mongo_uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true, // default recommended options
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then((e) => {
    console.log("MongoDB ready");
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection("uploads");
  })
  .catch(console.error);

const storage = new GridFsStorage({
  url: mongo_uri,
  file: (req, file: any) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const extension = getFileExtension(filename);
      if (!(extension in FileTypes)) return reject();
      if (!file) return reject();
      const fileInfo: any = {
        filename: filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});
const uploadMiddleWare = multer({ storage });
// Optional: Configure cors to prevent unauthorised domain to access your resources
const corsOptionsDelegate = (req: Request, callback: any) => {
  let corsOptions;
  // Enable CORS for this request
  corsOptions = {
    origin: true,
    "cross-origin-resource-policy": "cross-origin",
  };
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.use(helmet());
app.use(bodyParser.json({ limit: `${fileSizeLimit}mb` }));
app.use(bodyParser.urlencoded({ extended: true }));
routes(app, uploadMiddleWare);
// app.use(errorMiddleware);
const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, () =>
  console.log("Server is up and running at port: " + port)
);

