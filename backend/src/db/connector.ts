import Grid from 'gridfs-stream';
import mongoose, { ConnectOptions } from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { getMongoUrl } from '.';
import { getFileExtension } from '../utils';
import { FileTypes } from '../constants/enum';

export let uploadMiddleWare: multer.Multer;
let connection: Promise<mongoose.Mongoose> | null = null;
import { ServerApiVersion } from 'mongodb';

export const connectDatabase = async () => {
  if (connection === null) {
    let mongoUrl = await getMongoUrl();

    try {
      console.log(`MongoDB Connecting...`);
      connection = mongoose.connect(mongoUrl, {
        serverSelectionTimeoutMS: 5000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    dbName: 'platform',
  } as ConnectOptions);

      await connection;
      console.log(`MongoDB Connected!`);
    } catch (err: any) {
      console.error(`MongoDB connection failed: ${err.message}`);
    }

    initGrid();
    initGridFs(mongoUrl);
  }

  return connection;
};

const initGrid = () => {
  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
};

const initGridFs = (mongoUrl: string) => {
  const storage = new GridFsStorage({
    url: mongoUrl,
    file: (req, file: any) => {
      return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const extension = getFileExtension(filename);
        if (!(extension in FileTypes)) return reject();
        if (!file) return reject();
        const fileInfo: any = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    },
  });

  uploadMiddleWare = multer({ storage });
};
