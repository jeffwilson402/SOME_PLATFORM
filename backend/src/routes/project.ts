import { Application, Router } from 'express';
import { Multer } from 'multer';
import projectController from '../controllers/project';
import middleware from '../middleware';
const projectRoute = (app: Application, uploadMiddleWare: Multer) => {
  const router = Router();
  router.post('/all', middleware, projectController.all);
  router.post('/save', middleware, projectController.save);
  router.delete('/delete/:_id', middleware, projectController.delete);
  router.get('/:_id', middleware, projectController.getById);
  // router.post(
  //   "/upload_file",
  //   [uploadMiddleWare.single("file"), middleware],
  //   projectController.fileUpload
  // );
  router.post('/download_document', middleware, projectController.fileDownload);
  router.post('/delete_document', middleware, projectController.deleteDocument);
  router.post('/add_member', middleware, projectController.addMemberToTeam);
  router.post('/delete_team_member', middleware, projectController.deleteTeamMember);
  router.post('/save_team_member', middleware, projectController.saveTeamMember);
  app.use('/api/project', router);
};

export default projectRoute;
