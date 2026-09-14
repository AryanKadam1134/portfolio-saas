import { Router } from "express";

import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getCategoryById } from "../../middlewares/skillCategory.middleware.js";

import {
  addSkillCategory,
  deleteSkillCategory,
  getAllCategoryWiseSkills,
  getSkillCategory,
  updateSkillCategory,
} from "../../controllers/private/skillCategory.controller.js";

const skillCategoryRouter = Router();

skillCategoryRouter.use(verifyJWT);

skillCategoryRouter
  .route("/")
  .post(addSkillCategory)
  .get(getAllCategoryWiseSkills);

skillCategoryRouter
  .route("/:categoryId")
  .get(getCategoryById, getSkillCategory)
  .patch(getCategoryById, updateSkillCategory)
  .delete(getCategoryById, deleteSkillCategory);

export default skillCategoryRouter;
