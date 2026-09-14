import { Experience } from "../../models/experience.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import asynchandler from "../../utils/asynchandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import { paginateQuery } from "../../utils/paginatedQuery.js";

const addExperience = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    organization,
    description,
    employmentType,
    organizationSize,
    organizationWebsite,
    location,
    locationType,
    positions,
    highlights,
    techStack,
    visibility,
  } = req.body;

  if (!organization) {
    throw new ApiError(400, "Organization is required!");
  }

  const oragnizationExists = await Experience.findOne({
    owner: loggedUserId,
    organization,
  });

  if (oragnizationExists) {
    throw new ApiError(409, "Organization name already exists!");
  }

  const fields = {};

  fields.organization = organization;

  if (description) fields.description = description;
  if (employmentType) fields.employmentType = employmentType;
  if (organizationSize) fields.organizationSize = organizationSize;
  if (organizationWebsite) fields.organizationWebsite = organizationWebsite;
  if (location) fields.location = location;
  if (locationType) fields.locationType = locationType;
  if (visibility) fields.visibility = visibility;

  if (positions?.length > 0)
    fields.positions = Array.isArray(positions)
      ? positions
      : JSON.parse(positions);

  if (techStack?.length > 0)
    fields.techStack = Array.isArray(techStack)
      ? techStack
      : JSON.parse(techStack);

  if (highlights?.length > 0)
    fields.highlights = Array.isArray(highlights)
      ? highlights
      : JSON.parse(highlights);

  let uploadedOrganizationImage;

  const organizationImage = req.file?.path;

  if (organizationImage)
    uploadedOrganizationImage = await uploadToCloudinary(organizationImage);

  if (uploadedOrganizationImage?.secure_url) {
    fields.organizationImage = {
      url: uploadedOrganizationImage?.secure_url,
      public_id: uploadedOrganizationImage?.public_id,
      resource_type: uploadedOrganizationImage?.resource_type,
    };
  }

  const createdOrganization = await Experience.create({
    owner: loggedUserId,
    ...fields,
  });

  return res
    .status(201)
    .json(
      new ApiRes(201, createdOrganization, "experience created successfully!"),
    );
});

const updateExperience = asynchandler(async (req, res) => {
  const experience = req.experience;

  const {
    organization,
    description,
    employmentType,
    organizationSize,
    organizationWebsite,
    location,
    locationType,
    positions,
    highlights,
    techStack,
    visibility,
  } = req.body;

  if (organization) {
    const sameOrganizationName = await Experience.findOne({
      _id: { $ne: experience._id },
      owner: experience?.owner,
      organization,
    });

    if (sameOrganizationName) {
      throw new ApiError(409, "Organization name already exists!");
    }
  }

  const fields = {};

  if (organization) fields.organization = organization;

  if (visibility) fields.visibility = visibility;

  // Can be null values
  if (description !== undefined) fields.description = description;
  if (employmentType !== undefined) fields.employmentType = employmentType;
  if (organizationSize !== undefined)
    fields.organizationSize = organizationSize;
  if (organizationWebsite !== undefined)
    fields.organizationWebsite = organizationWebsite;
  if (location !== undefined) fields.location = location;
  if (locationType !== undefined) fields.locationType = locationType;

  if (positions !== undefined)
    fields.positions = Array.isArray(positions)
      ? positions
      : JSON.parse(positions);

  if (techStack !== undefined)
    fields.techStack = Array.isArray(techStack)
      ? techStack
      : JSON.parse(techStack);

  if (highlights !== undefined)
    fields.highlights = Array.isArray(highlights)
      ? highlights
      : JSON.parse(highlights);

  Object.assign(experience, fields);

  const updatedExperience = await experience.save();

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedExperience, "Experience updated successfully!"),
    );
});

const updateOrganizationImage = asynchandler(async (req, res) => {
  const experience = req.experience;

  const organizationImage = req.file?.path;

  if (!organizationImage) {
    throw new ApiError(400, "Missing image file path!");
  }

  const updatedImage = await uploadToCloudinary(organizationImage);

  if (!updatedImage?.secure_url) {
    throw new ApiError(500, "Error while updating image on cloudinary!");
  }

  const updatedExperience = await Experience.findByIdAndUpdate(
    experience._id,
    {
      $set: {
        organizationImage: {
          url: updatedImage?.secure_url,
          public_id: updatedImage?.public_id,
          resource_type: updatedImage?.resource_type,
        },
      },
    },
    { new: true },
  );

  if (experience?.organizationImage?.public_id) {
    try {
      await deleteFromCloudinary(experience.organizationImage);
    } catch (error) {
      console.error(
        "Error deleting organizationImage in updateOrganizationImage: ",
        error,
      );
    }
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        updatedExperience,
        "organizationImage updated successfully!",
      ),
    );
});

const deleteExperience = asynchandler(async (req, res) => {
  const experience = req.experience;

  await experience.deleteOne();

  if (experience?.organizationImage?.public_id) {
    try {
      await deleteFromCloudinary(experience.organizationImage);
    } catch (error) {
      console.error(
        "Error deleting organizationImage in deleteExperience: ",
        error,
      );
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, null, "Experience deleted successfully!"));
});

const deleteOrganiaztionImage = asynchandler(async (req, res) => {
  const experience = req.experience;

  const upatedExpereince = await Experience.findByIdAndUpdate(
    experience._id,
    {
      $unset: { organizationImage: "" },
    },
    { new: true },
  );

  if (experience?.organizationImage?.public_id) {
    try {
      await deleteFromCloudinary(experience.organizationImage);
    } catch (error) {
      console.error(
        "Error deleting organizationImage in deleteOrganiaztionImage: ",
        error,
      );
    }
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        upatedExpereince,
        "organizationImage deleted successfully!",
      ),
    );
});

const getExperience = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.experience, "experience fetched successfully!"));
});

const getAllExperiences = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  const paginatedExperiences = await paginateQuery({
    model: Experience,
    page,
    limit,
    filter: {
      owner: req.user?._id,
    },
    sort: { sortOrder: 1 },
  });

  if (paginatedExperiences?.data?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, paginatedExperiences, "no experiences found!"));
  }

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

export {
  addExperience,
  updateExperience,
  updateOrganizationImage,
  deleteExperience,
  deleteOrganiaztionImage,
  getExperience,
  getAllExperiences,
};
