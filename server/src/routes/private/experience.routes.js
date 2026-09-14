import { Router } from "express";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getExperienceById } from "../../middlewares/experience.middleware.js";

import {
  addExperience,
  deleteExperience,
  deleteOrganiaztionImage,
  getAllExperiences,
  getExperience,
  updateExperience,
  updateOrganizationImage,
} from "../../controllers/private/experience.controller.js";

const experienceRouter = Router();

experienceRouter.use(verifyJWT);

experienceRouter
  .route("/")
  .post(upload.single("organizationImage"), addExperience)
  .get(getAllExperiences);

experienceRouter
  .route("/:experienceId")
  .get(getExperienceById, getExperience)
  .patch(getExperienceById, updateExperience)
  .delete(getExperienceById, deleteExperience);

experienceRouter
  .route("/:experienceId/organization-image")
  .patch(
    getExperienceById,
    upload.single("organizationImage"),
    updateOrganizationImage,
  )
  .delete(getExperienceById, deleteOrganiaztionImage);

export default experienceRouter;
