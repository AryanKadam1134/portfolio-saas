import { Router } from "express";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getEducationById } from "../../middlewares/education.middleware.js";

import {
  addEducation,
  deleteEducation,
  deleteInstituteImage,
  getAllEducations,
  getEducation,
  updateEducationDetails,
  updateInstituteImage,
} from "../../controllers/private/education.controller.js";

const educationRouter = Router();

educationRouter.use(verifyJWT);

educationRouter
  .route("/")
  .post(upload.single("instituteImage"), addEducation)
  .get(getAllEducations);

educationRouter
  .route("/:educationId")
  .get(getEducationById, getEducation)
  .patch(getEducationById, updateEducationDetails)
  .delete(getEducationById, deleteEducation);

educationRouter
  .route("/:educationId/institute-image")
  .patch(
    getEducationById,
    upload.single("instituteImage"),
    updateInstituteImage,
  )
  .delete(getEducationById, deleteInstituteImage);

export default educationRouter;
