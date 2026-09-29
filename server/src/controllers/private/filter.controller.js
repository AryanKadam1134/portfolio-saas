import { Skill } from "../../models/skill.model.js";
import { Experience } from "../../models/experience.model.js";
import { Certificate } from "../../models/certificate.model.js";
import { SkillCategory } from "../../models/skillCategory.model.js";

import ApiRes from "../../utils/ApiRes.js";
import { asynchandler } from "../../utils/asynchandler.js";

import {
  SKILL_LEVEL,
  SOCIAL_PLATFORMS,
  GENDERS,
  EMPLOYMENT_TYPE,
  VISIBILITY,
  PROJECT_CATEGORIES,
  LOCATION_TYPE,
} from "../../constants.js";

const getSocialPlatforms = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, SOCIAL_PLATFORMS, "Social platforms fetched!"));
});

const getSkillCategories = asynchandler(async (req, res) => {
  const categories = await SkillCategory.find({
    owner: req.user?._id,
  });

  if (categories?.length === 0) {
    return res.status(200).json(new ApiRes(200, [], "No categories found!"));
  }

  const formatted = categories?.map((category) => ({
    label: category?.name,
    value: category?._id,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, formatted, "Categories fetched!"));
});

const getAllOrganizations = asynchandler(async (req, res) => {
  const organizations = await Experience.find({
    owner: req.user?._id,
  });

  if (organizations?.length === 0) {
    return res.status(200).json(new ApiRes(200, [], "No organizations found!"));
  }

  const formatted = organizations?.map((category) => ({
    label: category?.organization,
    value: category?._id,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, formatted, "Organizations fetched!"));
});

const getProjectCategories = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, PROJECT_CATEGORIES, "Project categories fetched!"));
});

const getAllSkills = asynchandler(async (req, res) => {
  const skills = await Skill.find({
    owner: req.user?._id,
  });

  if (skills?.length === 0) {
    return res.status(200).json(new ApiRes(200, [], "No skills found!"));
  }

  const formatted = skills?.map((category) => ({
    label: category?.name,
    value: category?._id,
  }));

  return res.status(200).json(new ApiRes(200, formatted, "Skills fetched!"));
});

const getAllCertificates = asynchandler(async (req, res) => {
  const certificates = await Certificate.find({
    owner: req.user?._id,
  });

  if (certificates?.length === 0) {
    return res.status(200).json(new ApiRes(200, [], "No certificates found!"));
  }

  const formatted = certificates?.map((certificate) => ({
    label: certificate?.title,
    value: certificate?._id,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, formatted, "Certificates fetched!"));
});

const getSkillLevel = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, SKILL_LEVEL, "Skill levels fetched!"));
});

const getGenders = asynchandler(async (req, res) => {
  return res.status(200).json(new ApiRes(200, GENDERS, "Genders fetched!"));
});

const getEmploymentTypes = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, EMPLOYMENT_TYPE, "Employment types fetched!"));
});

const getLocationTypes = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, LOCATION_TYPE, "Location types fetched!"));
});

const getVisibility = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, VISIBILITY, "Visibility fetched!"));
});

export {
  getSocialPlatforms,
  getSkillCategories,
  getAllOrganizations,
  getProjectCategories,
  getAllSkills,
  getAllCertificates,
  getSkillLevel,
  getGenders,
  getEmploymentTypes,
  getLocationTypes,
  getVisibility,
};
