import { Project } from "../models/project.model.js";

import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getProjectById = asynchandler(async (req, res, next) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "projectId is required!");
  }

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw new ApiError(404, "Project not found!");
  }

  if (projectExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.project = projectExists;

  next();
});
