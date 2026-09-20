import mongoose from "mongoose";

import { Skill } from "../../models/skill.model.js";
import { SkillCategory } from "../../models/skillCategory.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { paginateAggregate } from "../../utils/pagination.js";

const addSkill = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    name,
    description,
    categoryId,
    level,
    logoUrl,
    visibility,
    sortOrder,
  } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required!");
  }

  const skillExists = await Skill.findOne({
    owner: loggedUserId,
    name,
  });

  if (skillExists) {
    throw new ApiError(409, "Skill already exists!");
  }

  const fields = {};

  fields.name = name;
  if (level) fields.level = level;
  if (visibility) fields.visibility = visibility;

  // Can be null values
  if (logoUrl !== undefined) fields.logoUrl = logoUrl;
  if (description !== undefined) fields.description = description;

  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  // Check if category exists
  if (categoryId) {
    const categoryExists = await SkillCategory.findById(categoryId);

    if (!categoryExists) {
      throw new ApiError(404, "Category not found!");
    }

    fields.categoryId = categoryId;
  }

  const newSkill = await Skill.create({
    owner: loggedUserId,
    ...fields,
  });

  return res
    .status(201)
    .json(new ApiRes(201, newSkill, "Skill added successfully!"));
});

const updateSkill = asynchandler(async (req, res) => {
  const skill = req.skill;

  const {
    name,
    description,
    categoryId,
    level,
    logoUrl,
    visibility,
    sortOrder,
  } = req.body;

  if (name) {
    const sameSkillName = await Skill.findOne({
      _id: { $ne: skill._id },
      owner: skill?.owner,
      name,
    });

    if (sameSkillName) {
      throw new ApiError(409, "Skill name already exists!");
    }
  }

  const fields = {};

  if (name) fields.name = name;
  if (level) fields.level = level;
  if (visibility) fields.visibility = visibility;

  // Can be null values
  if (logoUrl !== undefined) fields.logoUrl = logoUrl;
  if (description !== undefined) fields.description = description;

  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  // Check if category exists (can be null)
  if (categoryId !== undefined) {
    const categoryExists = await SkillCategory.findById(categoryId);

    // if null do not throw error
    if (categoryId && !categoryExists) {
      throw new ApiError(404, "Category not found!");
    }

    fields.categoryId = categoryId;
  }

  if (Object.keys(fields).length === 0) {
    throw new ApiError(400, "No fields provided to update!");
  }

  const updatedSkill = await Skill.findByIdAndUpdate(
    skill?._id,
    {
      $set: fields,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiRes(200, updatedSkill, "skill updated successfully!"));
});

const deleteSkill = asynchandler(async (req, res) => {
  await req.skill.deleteOne();

  return res
    .status(200)
    .json(new ApiRes(200, null, "skill deleted successfully!"));
});

const getSkill = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.skill, "skill fetched successfully!"));
});

const getAllSkillWithCategory = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  const paginatedSkills = await paginateAggregate({
    model: Skill,
    pipeline: [
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user?._id),
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
    ],
    page,
    limit,
  });

  if (paginatedSkills?.data?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, paginatedSkills, "no skills found!"));
  }

  return res
    .status(200)
    .json(new ApiRes(200, paginatedSkills, "skills fetched successfully!"));
});

export {
  addSkill,
  updateSkill,
  deleteSkill,
  getSkill,
  getAllSkillWithCategory,
};
