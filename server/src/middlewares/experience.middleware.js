import { Experience } from "../models/experience.model.js";

import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getExperienceById = asynchandler(async (req, res, next) => {
  const { experienceId } = req.params;

  if (!experienceId) {
    throw new ApiError(400, "experienceId is required!");
  }

  const experienceExists = await Experience.findById(experienceId);

  if (!experienceExists) {
    throw new ApiError(404, "Experience not found!");
  }

  if (experienceExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.experience = experienceExists;

  next();
});
