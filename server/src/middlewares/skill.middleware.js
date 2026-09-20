import { Skill } from "../models/skill.model.js";

import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getSkillById = asynchandler(async (req, res, next) => {
  const { skillId } = req.params;

  if (!skillId) {
    throw new ApiError(400, "skillId is required!");
  }

  const skillExists = await Skill.findById(skillId);

  if (!skillExists) {
    throw new ApiError(404, "Skill not found!");
  }

  if (skillExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.skill = skillExists;

  next();
});
