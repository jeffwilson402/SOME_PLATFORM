import { Application, Router } from 'express';
import { Multer } from 'multer';
import userController from '../controllers/user';
import middleware from '../middleware';
import EndPointMiddleWare from '../middleware/endpoint';

const userRoute = (app: Application, uploadMiddleWare: Multer) => {
  const router = Router();
  router.post('/signin', userController.signin);
  router.post('/core/all', middleware, userController.allCoreTeam);
  router.post('/talent/all', middleware, userController.allEngineers);
  router.post('/create', middleware, userController.create);
  router.post('/save', middleware, userController.save);
  router.post('/permission', middleware, userController.savePermission);
  router.post('/financials', middleware, userController.getFinancials);
  router.get('/:_id', middleware, userController.getById);
  router.delete('/:_id', middleware, userController.delete);
  // router.post(
  //   "/upload_file",
  //   [uploadMiddleWare.single("file"), middleware],
  //   userController.fileUpload
  // );
  router.post('/download_document', middleware, userController.fileDownload);
  router.post('/delete_document', middleware, userController.deleteDocument);
  router.post('/candidates', EndPointMiddleWare, userController.createCandidate);
  router.post('/candidates/:user_id/files', EndPointMiddleWare, userController.saveCandidateFiles);
  router.post('/add_skill', userController.addSkill);
  router.post('/save_skill', userController.saveSkill);
  router.get('/skills/:_id', userController.getSkillsById);
  router.get('/roles/:_id', userController.getRolesById);
  router.post('/roles/add', userController.addRole);
  router.post('/manage_projects', userController.assignProjects);
  router.post('/options', userController.getUserOptions);
  router.post('/update_profile', middleware, userController.updateProfile);
  router.post('/verify_email', userController.verifyEmail);
  router.post('/endpoint_login', userController.endPointSignIn);
  router.post('/external_user', userController.saveUserForExternal);
  router.get("/external_user/get", userController.getExternalUsers);
  router.get("/external_user/getOne", userController.getExternalUser);
  router.get("/codility/tests", userController.getCodilityTests);
  router.post("/codility/send", userController.sendCodilityTest);
  app.use('/api/user', router);
};

export default userRoute;
