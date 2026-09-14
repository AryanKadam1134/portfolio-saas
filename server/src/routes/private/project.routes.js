import { Router } from "express";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getProjectById } from "../../middlewares/project.middleware.js";

import {
  addProject,
  deleteProject,
  deleteProjectImage,
  getAllProjects,
  getProject,
  updateProjectDetails,
  updateProjectImages,
} from "../../controllers/private/project.controller.js";

const projectRouter = Router();

projectRouter.use(verifyJWT);

projectRouter
  .route("/")
  .post(upload.array("projectImages", 5), addProject)
  .get(getAllProjects);

projectRouter
  .route("/:projectId")
  .get(getProjectById, getProject)
  .patch(getProjectById, updateProjectDetails)
  .delete(getProjectById, deleteProject);

projectRouter
  .route("/:projectId/project-images")
  .patch(getProjectById, upload.array("projectImages", 5), updateProjectImages);

projectRouter
  .route("/:projectId/project-images/:imagePublicId")
  .delete(getProjectById, deleteProjectImage);

export default projectRouter;
