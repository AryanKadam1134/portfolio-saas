import mongoose from "mongoose";

import { Skill } from "../../models/skill.model.js";
import { Project } from "../../models/project.model.js";
import { Education } from "../../models/education.model.js";
import { Experience } from "../../models/experience.model.js";
import { Certificate } from "../../models/certificate.model.js";
import { Achievement } from "../../models/achievement.model.js";
import { SkillCategory } from "../../models/skillCategory.model.js";
import { SocialPlatform } from "../../models/socialPlatform.model.js";

import ApiRes from "../../utils/ApiRes.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { paginateAggregate } from "../../utils/pagination.js";
import { sortPositionsByDate } from "../../utils/sortPositionsByDate.js";

const healthCheck = async (req, res) => {
  return res.status(200).json(new ApiRes(200, {}, "OK"));
};

const getProfileSummary = asynchandler(async (req, res) => {
  const commonQuery = { owner: req.user?._id };

  const findQuery = { ...commonQuery, visibility: "public" };

  const [
    socialPlatforms,
    projects,
    skillCategories,
    skills,
    experiences,
    certificates,
    achievements,
    educations,
  ] = await Promise.all([
    SocialPlatform.find(findQuery),
    Project.find(findQuery),
    SkillCategory.find(findQuery),
    Skill.find(findQuery),
    Experience.find(findQuery),
    Certificate.find(findQuery),
    Achievement.find(findQuery),
    Education.find(commonQuery),
  ]);

  const summary = {
    socialPlatforms: socialPlatforms?.length,
    projects: projects?.length,
    skillCategories: skillCategories?.length,
    skills: skills?.length,
    experiences: experiences?.length,
    certificates: certificates?.length,
    achievements: achievements?.length,
    educations: educations?.length,
  };

  return res
    .status(200)
    .json(new ApiRes(200, summary, "summary fetched successfully!"));
});

const getUserByUsername = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.user, "user data fetched successfully!"));
});

const getUserSocialPlatforms = asynchandler(async (req, res) => {
  const platforms = await SocialPlatform.find({
    owner: req.user?._id,
    visibility: "public",
  })
    .sort({ sortOrder: 1 })
    .lean();

  return res
    .status(200)
    .json(new ApiRes(200, platforms, "Platforms fetched successfully!"));
});

const getSkillWithCategory = asynchandler(async (req, res) => {
  const skills = await Skill.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
        visibility: "public",
      },
    },
    {
      $lookup: {
        from: "skillcategories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $addFields: {
        category: {
          $first: "$category",
        },
      },
    },
    {
      $sort: {
        sortOrder: 1,
      },
    },
  ]);

  if (skills?.length === 0) {
    return res.status(200).json(new ApiRes(200, [], "no skills found!"));
  }

  return res
    .status(200)
    .json(new ApiRes(200, skills, "skills fetched successfully!"));
});

const getCategoryWiseSkills = asynchandler(async (req, res) => {
  const categories = await SkillCategory.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
        visibility: "public",
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "_id",
        foreignField: "categoryId",
        as: "skills",
        pipeline: [
          {
            $match: {
              visibility: "public",
            },
          },
        ],
      },
    },
    {
      $sort: {
        sortOrder: 1,
      },
    },
  ]);

  if (categories?.length === 0) {
    return res.status(200).json(new ApiRes(200, [], "no categories found!"));
  }

  return res
    .status(200)
    .json(new ApiRes(200, categories, "categories fetched successfully!"));
});

const getProjects = asynchandler(async (req, res) => {
  const { featured = "all", page, limit } = req.query;

  const fields = {
    owner: new mongoose.Types.ObjectId(req.user?._id),
    visibility: "public",
  };

  if (featured !== "all") fields.featured = featured === "true";

  const pipeline = [
    {
      $match: fields,
    },
    {
      $lookup: {
        from: "skills",
        localField: "techStack",
        foreignField: "_id",
        as: "techStack",
      },
    },
    {
      $lookup: {
        from: "experiences",
        localField: "organizationId",
        foreignField: "_id",
        as: "organizationDetails",
      },
    },
    {
      $addFields: {
        organizationDetails: {
          $first: "$organizationDetails",
        },
      },
    },
    {
      $sort: {
        sortOrder: 1,
      },
    },
  ];

  const paginatedProjects = await paginateAggregate({
    model: Project,
    pipeline,
    page,
    limit,
  });

  if (paginatedProjects?.data?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, paginatedProjects, "no projects found!"));
  }

  return res
    .status(200)
    .json(new ApiRes(200, paginatedProjects, "projects fetched successfully!"));
});

const getExperiences = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
        visibility: "public",
      },
    },
    {
      $sort: { latestDate: -1 },
    },
    {
      $lookup: {
        from: "skills",
        localField: "techStack",
        foreignField: "_id",
        as: "techStack",
      },
    },
  ];

  const paginatedExperiences = await paginateAggregate({
    model: Experience,
    pipeline,
    page,
    limit,
  });

  if (paginatedExperiences?.data?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, paginatedExperiences, "no experiences found!"));
  }

  paginatedExperiences.data.forEach((exp) => {
    exp.position = sortPositionsByDate(exp.position);
  });

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        paginatedExperiences,
        "experiences fetched successfully!",
      ),
    );
});

const getEducations = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $sort: { latestYear: 1 },
    },
  ];

  const paginatedEducations = await paginateAggregate({
    model: Education,
    pipeline,
    page,
    limit,
  });

  if (paginatedEducations?.data?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, paginatedEducations, "no educations found!"));
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, paginatedEducations, "educations fetched successfully!"),
    );
});

const getCertificates = asynchandler(async (req, res) => {
  const { featured = "all", page, limit } = req.query;

  const fields = {
    owner: new mongoose.Types.ObjectId(req.user?._id),
    visibility: "public",
  };

  if (featured !== "all") fields.featured = featured === "true";

  const pipeline = [
    {
      $match: fields,
    },
    {
      $lookup: {
        from: "skills",
        localField: "skills",
        foreignField: "_id",
        as: "skills",
      },
    },
    {
      $sort: {
        sortOrder: 1,
      },
    },
  ];

  const paginatedCertificates = await paginateAggregate({
    model: Certificate,
    pipeline,
    page,
    limit,
  });

  if (paginatedCertificates?.data?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, paginatedCertificates, "no certificates found!"));
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        paginatedCertificates,
        "certificates fetched successfully!",
      ),
    );
});

const getAchievements = asynchandler(async (req, res) => {
  const { featured = "all", page, limit } = req.query;

  const fields = {
    owner: new mongoose.Types.ObjectId(req.user?._id),
    visibility: "public",
  };

  if (featured !== "all") fields.featured = featured === "true";

  const pipeline = [
    {
      $match: fields,
    },
    {
      $lookup: {
        from: "certificates",
        localField: "certificateId",
        foreignField: "_id",
        as: "certificateDetails",
      },
    },
    {
      $addFields: {
        certificateDetails: {
          $first: "$certificateDetails",
        },
      },
    },
    {
      $sort: {
        sortOrder: 1,
      },
    },
  ];

  const paginatedAchievements = await paginateAggregate({
    model: Achievement,
    pipeline,
    page,
    limit,
  });

  if (paginatedAchievements?.data?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, paginatedAchievements, "no achievements found!"));
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        paginatedAchievements,
        "achievements fetched successfully!",
      ),
    );
});

export {
  healthCheck,
  getProfileSummary,
  getUserByUsername,
  getUserSocialPlatforms,
  getSkillWithCategory,
  getCategoryWiseSkills,
  getProjects,
  getExperiences,
  getEducations,
  getCertificates,
  getAchievements,
};
