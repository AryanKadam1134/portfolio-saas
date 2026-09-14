import { Router } from "express";

import { findUserByUsername } from "../../middlewares/user.middleware.js";

import {
  getAchievements,
  getCategoryWiseSkills,
  getCertificates,
  getEducations,
  getExperiences,
  getProfileSummary,
  getProjects,
  getSkillWithCategory,
  getUserByUsername,
  getUserSocialPlatforms,
} from "../../controllers/public/portfolio.controller.js";

const portfolioRouter = Router();

portfolioRouter
  .route("/:username/summary")
  .get(findUserByUsername, getProfileSummary);

portfolioRouter
  .route("/:username/details")
  .get(findUserByUsername, getUserByUsername);

portfolioRouter
  .route("/:username/social-platforms")
  .get(findUserByUsername, getUserSocialPlatforms);

portfolioRouter
  .route("/:username/skills")
  .get(findUserByUsername, getSkillWithCategory);

portfolioRouter
  .route("/:username/categories")
  .get(findUserByUsername, getCategoryWiseSkills);

portfolioRouter
  .route("/:username/projects")
  .get(findUserByUsername, getProjects);

portfolioRouter
  .route("/:username/experiences")
  .get(findUserByUsername, getExperiences);

portfolioRouter
  .route("/:username/educations")
  .get(findUserByUsername, getEducations);

portfolioRouter
  .route("/:username/certificates")
  .get(findUserByUsername, getCertificates);

portfolioRouter
  .route("/:username/achievements")
  .get(findUserByUsername, getAchievements);

export default portfolioRouter;
