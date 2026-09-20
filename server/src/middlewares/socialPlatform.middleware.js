import { SocialPlatform } from "../models/socialPlatform.model.js";

import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getSocialPlatformById = asynchandler(async (req, res, next) => {
  const { platformId } = req.params;

  if (!platformId) {
    throw new ApiError(400, "platformId is required!");
  }

  const platformExists = await SocialPlatform.findById(platformId);

  if (!platformExists) {
    throw new ApiError(404, "Platform not found!");
  }

  if (platformExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.socialPlatform = platformExists;

  next();
});
