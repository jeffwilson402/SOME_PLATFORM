import { Application, Router } from "express";
import {
  saveRoleCategory,
  getRoleCategories,
  saveRole,
  moveToActiveRole,
  getActiveRoles,
  getRoleById,
  getActiveRoleOptions,
} from "../controllers/role";
import EndPointMiddleWare from "../middleware/endpoint";

const roleRoute = (app: Application) => {
  const router = Router();
  router.post("/category/save", saveRoleCategory);
  router.post("/category/all", getRoleCategories);
  router.post("/save", saveRole);
  router.post("/activate", moveToActiveRole);
  router.post("/active", getActiveRoles);
  router.post("/active_options", getActiveRoleOptions);
  //Endpoints
  router.get("/all", EndPointMiddleWare, getActiveRoleOptions);
  router.get("/:refID", getRoleById);
  app.use("/api/role", router);
};

export default roleRoute;
