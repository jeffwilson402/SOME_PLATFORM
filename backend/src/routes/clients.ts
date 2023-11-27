import { Application, Router } from "express";
import clientsController from "../controllers/client";
const userRoute = (app: Application) => {
  const router = Router();
  router.post("/all", clientsController.getClients);
  app.use("/api/clients", router);
};

export default userRoute;
