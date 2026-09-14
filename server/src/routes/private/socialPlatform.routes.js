import { Router } from "express";

import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { getSocialPlatformById } from "../../middlewares/socialPlatform.middleware.js";

import {
  manageSocialPlatforms,
  getAllUserSocialPlatforms,
  deleteSocialPlatform,
  addSocialPlatform,
  updateSocialPlatform,
  getSocialPlatform,
} from "../../controllers/private/socialPlatform.controller.js";

const socialPlatformRouter = Router();

socialPlatformRouter.use(verifyJWT);

socialPlatformRouter.route("/manage").post(manageSocialPlatforms);

socialPlatformRouter
  .route("/")
  .post(addSocialPlatform)
  .get(getAllUserSocialPlatforms);

socialPlatformRouter
  .route("/:platformId")
  .get(getSocialPlatformById, getSocialPlatform)
  .patch(getSocialPlatformById, updateSocialPlatform)
  .delete(getSocialPlatformById, deleteSocialPlatform);

export default socialPlatformRouter;
