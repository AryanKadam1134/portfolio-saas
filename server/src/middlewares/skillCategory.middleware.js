import { SkillCategory } from "../models/skillCategory.model.js";

import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getCategoryById = asynchandler(async (req, res, next) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    throw new ApiError(400, "categoryId is required!");
  }

  const categoryExists = await SkillCategory.findById(categoryId);

  if (!categoryExists) {
    throw new ApiError(404, "Category not found!");
  }

  if (categoryExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.category = categoryExists;

  next();
});
