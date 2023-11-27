// import Grid from "gridfs-stream";
// import mongoose, { ConnectOptions, mongo } from "mongoose";
// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";
// import { mongo_uri } from "../db";
// let connection: any = null;
// let storage: any = null;
// let uploadMiddleWare:any = null;
// const connectDB = async () => {
//   await mongoose.connect(mongo_uri, {
//     useNewUrlParser: true, // default recommended options
//     useUnifiedTopology: true,
//   } as ConnectOptions);
//   connection = mongoose;
//   const gfs = Grid(connection.connection.db, connection.mongoose.mongo);
//   gfs.collection("uploads");
//   storage = new GridFsStorage({
//     url: mongo_uri,
//     file: (req, file: any) => {
//       return new Promise((resolve, reject) => {
//         const filename = file.originalname;
//         console.log(filename, "middleware");
//         const fileInfo: any = {
//           filename: filename,
//           bucketName: "uploads",
//         };
//         resolve(fileInfo);
//       });
//     },
//   });
//   uploadMiddleWare = multer({ storage });
// };
// connectDB();
// console.log("here");
// console.log(storage);
// export  uploadMiddleWare;
