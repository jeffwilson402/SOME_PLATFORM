import { Application, Router } from "express";
import skillController from "../controllers/skill";
import EndPointMiddleWare from "../middleware/endpoint";
const skillRoute = (app: Application) => {
  const router = Router();
  router.post("/all", skillController.all);
  router.post("/options", skillController.getOptions);
  router.post("/save", skillController.save);
  router.delete("/delete/:_id", skillController.delete);
  router.get("", EndPointMiddleWare, skillController.allForEndpoints);
  router.get("/:id", EndPointMiddleWare, skillController.getById);
  app.use("/api/skill", router);
};

export default skillRoute;
