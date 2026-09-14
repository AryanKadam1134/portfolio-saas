import { Router } from "express";

import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getSkillById } from "../../middlewares/skill.middleware.js";

import {
  addSkill,
  deleteSkill,
  getAllSkillWithCategory,
  getSkill,
  updateSkill,
} from "../../controllers/private/skill.controller.js";

const skillRouter = Router();

skillRouter.use(verifyJWT);

skillRouter.route("/").post(addSkill).get(getAllSkillWithCategory);

skillRouter
  .route("/:skillId")
  .get(getSkillById, getSkill)
  .patch(getSkillById, updateSkill)
  .delete(getSkillById, deleteSkill);

export default skillRouter;
