import { Router } from "express";

import { verifyJWT } from "../../middlewares/auth.middleware.js";

import {
  getAllCertificates,
  getAllOrganizations,
  getAllSkills,
  getEmploymentTypes,
  getGenders,
  getLocationTypes,
  getProjectCategories,
  getSkillCategories,
  getSkillLevel,
  getSocialPlatforms,
  getVisibility,
} from "../../controllers/private/filter.controller.js";

const filterRoutes = Router();

filterRoutes.route("/social-platforms").get(getSocialPlatforms);

filterRoutes.route("/skill-categories").get(verifyJWT, getSkillCategories);

filterRoutes.route("/organizations").get(verifyJWT, getAllOrganizations);

filterRoutes.route("/project-categories").get(verifyJWT, getProjectCategories);

filterRoutes.route("/skills").get(verifyJWT, getAllSkills);

filterRoutes.route("/certificates").get(verifyJWT, getAllCertificates);

filterRoutes.route("/skill-levels").get(getSkillLevel);

filterRoutes.route("/genders").get(getGenders);

filterRoutes.route("/employment-types").get(getEmploymentTypes);

filterRoutes.route("/location-types").get(getLocationTypes);

filterRoutes.route("/visibility").get(getVisibility);

export default filterRoutes;
