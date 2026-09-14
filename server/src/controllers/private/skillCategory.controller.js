import { SkillCategory } from "../../models/skillCategory.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import asynchandler from "../../utils/asynchandler.js";
import { paginateQuery } from "../../utils/paginatedQuery.js";

const addSkillCategory = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { name, logoUrl, visibility, sortOrder } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required!");
  }

  const category = await SkillCategory.findOne({
    owner: loggedUserId,
    name,
  });

  if (category) {
    throw new ApiError(409, "Category name already exists!");
  }

  const fields = {};

  fields.name = name;
  if (visibility) fields.visibility = visibility;

  if (logoUrl !== undefined) fields.logoUrl = logoUrl;
  if (typeof sortOrder == "number") fields.sortOrder = sortOrder;

  const newCategory = await SkillCategory.create({
    owner: loggedUserId,
    ...fields,
  });

  return res
    .status(201)
    .json(new ApiRes(201, newCategory, "category created successfully!"));
});

const updateSkillCategory = asynchandler(async (req, res) => {
  const category = req.category;

  const { name, logoUrl, visibility, sortOrder } = req.body;

  if (name) {
    const sameCategoryName = await SkillCategory.findOne({
      _id: { $ne: category._id },
      owner: category?.owner,
      name,
    });

    if (sameCategoryName) {
      throw new ApiError(409, "Category name already exists!");
    }
  }

  const fields = {};

  if (name) fields.name = name;
  if (visibility) fields.visibility = visibility;

  if (logoUrl !== undefined) fields.logoUrl = logoUrl;
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  if (Object.keys(fields).length === 0) {
    throw new ApiError(400, "No fields provided to update!");
  }

  const updatedCategory = await SkillCategory.findByIdAndUpdate(
    category._id,
    {
      $set: fields,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiRes(200, updatedCategory, "category updated successfully!"));
});

const deleteSkillCategory = asynchandler(async (req, res) => {
  await req.category.deleteOne();

  return res
    .status(200)
    .json(new ApiRes(200, null, "category deleted successfully!"));
});

const getSkillCategory = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.category, "category fetced successfully!"));
});

const getAllCategoryWiseSkills = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  const paginatedCategories = await paginateQuery({
    model: SkillCategory,
    page,
    limit,
    filter: {
      owner: req.user?._id,
    },
    sort: { sortOrder: 1 },
  });

  if (paginatedCategories?.data?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, paginatedCategories, "no categories found!"));
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, paginatedCategories, "categories fetched successfully!"),
    );
});

export {
  addSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  getSkillCategory,
  getAllCategoryWiseSkills,
};
