import { Application } from "express";
import userRoute from "./user";
import projectRoute from "./project";
import skillRoute from "./skill";
import roleRoute from "./role";
import analysisRoute from "./analysis";
import clientsRoute from './clients';
import { Multer } from "multer";
const routes = (app: Application, uploadMiddleWare: Multer) => {
  userRoute(app,uploadMiddleWare);
  projectRoute(app, uploadMiddleWare);
  skillRoute(app);
  roleRoute(app);
  analysisRoute(app);
  clientsRoute(app);
};
export default routes;
