import { Application, Router } from "express";
import {
  getAssignedRoles,
  getClaimedSkills,
  getExternalRegistrants,
  getGoalsAnalysis,
  getInfo,
  getProjectAssignments,
  getTotalSkilledEngineers,
} from "../controllers/analytics";
import middleware from "../middleware";
const analysisRoute = (app: Application) => {
  const router = Router();
  router.get("/info", middleware, getInfo);
  router.get("/total_skilled_engineers", middleware, getTotalSkilledEngineers);
  router.get("/assigned_roles", middleware, getAssignedRoles);
  router.get("/claimed_skills", middleware, getClaimedSkills);
  router.get("/project_assignments", middleware, getProjectAssignments);
  router.get("/external_registrants", middleware, getExternalRegistrants);
  router.get("/goals_accomplished", middleware, getGoalsAnalysis);
  app.use("/api/analysis", router);
};

export default analysisRoute;
