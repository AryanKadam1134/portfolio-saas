import { Education } from "../../models/education.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import { paginateQuery } from "../../utils/pagination.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { parseBoolean } from "../../utils/parseBoolean.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";

const addEducation = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    instituteName,
    qualification,
    description,
    location,
    startYear,
    endYear,
    isCurrent,
    percentage,
    cgpa,
  } = req.body;

  if (!instituteName) {
    throw new ApiError(400, "InstituteName is required!");
  }

  if (!qualification) {
    throw new ApiError(400, "Qualification is required!");
  }

  const educationExists = await Education.findOne({
    owner: loggedUserId,
    instituteName,
  });

  if (educationExists) {
    throw new ApiError(409, "Education already exists!");
  }

  const fields = {};

  fields.instituteName = instituteName;
  fields.qualification = qualification;

  if (description) fields.description = description;
  if (location) fields.location = location;
  if (startYear) fields.startYear = startYear;
  if (endYear) fields.endYear = endYear;
  if (percentage) fields.percentage = Number(percentage);
  if (cgpa) fields.cgpa = Number(cgpa);

  if (isCurrent !== undefined) fields.isCurrent = parseBoolean(isCurrent);

  let uploadedInstituteImage;

  const instituteImage = req.file?.path;

  if (instituteImage)
    uploadedInstituteImage = await uploadToCloudinary(instituteImage);

  if (uploadedInstituteImage?.secure_url) {
    fields.instituteImage = {
      url: uploadedInstituteImage?.secure_url,
      public_id: uploadedInstituteImage?.public_id,
      resource_type: uploadedInstituteImage?.resource_type,
    };
  }

  const createdInstitute = await Education.create({
    owner: loggedUserId,
    ...fields,
  });

  return res
    .status(201)
    .json(new ApiRes(201, createdInstitute, "institute created successfully!"));
});

const updateEducationDetails = asynchandler(async (req, res) => {
  const education = req.education;

  const {
    instituteName,
    qualification,
    description,
    location,
    startYear,
    endYear,
    isCurrent,
    percentage,
    cgpa,
  } = req.body;

  if (instituteName) {
    const sameInstituteName = await Education.findOne({
      _id: { $ne: education._id },
      owner: education.owner,
      instituteName,
    });

    if (sameInstituteName) {
      throw new ApiError(409, "Institute name already exists!");
    }
  }

  const fields = {};

  if (instituteName) fields.instituteName = instituteName;
  if (qualification) fields.qualification = qualification;

  // Can be null values
  if (description !== undefined) fields.description = description;
  if (location !== undefined) fields.location = location;
  if (startYear !== undefined) fields.startYear = startYear;
  if (endYear !== undefined) fields.endYear = endYear;
  if (percentage !== undefined) fields.percentage = Number(percentage);
  if (cgpa !== undefined) fields.cgpa = Number(cgpa);

  if (isCurrent !== undefined) fields.isCurrent = parseBoolean(isCurrent);

  Object.assign(education, fields);

  const updatedEducation = await education.save();

  return res
    .status(200)
    .json(new ApiRes(200, updatedEducation, "education updated successfully!"));
});

const updateInstituteImage = asynchandler(async (req, res) => {
  const education = req.education;

  const instituteImage = req.file?.path;

  if (!instituteImage) {
    throw new ApiError(400, "Missing image file path!");
  }

  const updatedImage = await uploadToCloudinary(instituteImage);

  if (!updatedImage?.secure_url) {
    throw new ApiError(
      500,
      "Error while updating instituteImage on cloudinary!",
    );
  }

  const updatedEducation = await Education.findByIdAndUpdate(
    education._id,
    {
      $set: {
        instituteImage: {
          url: updatedImage?.secure_url,
          public_id: updatedImage?.public_id,
          resource_type: updatedImage?.resource_type,
        },
      },
    },
    { new: true },
  );

  if (education?.instituteImage?.public_id) {
    try {
      await deleteFromCloudinary(education.instituteImage);
    } catch (error) {
      console.error(
        "Error deleting instituteImage in updateInstituteImage: ",
        error,
      );
    }
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedEducation, "instituteImage updated successfully!"),
    );
});

const deleteEducation = asynchandler(async (req, res) => {
  const education = req.education;

  await education.deleteOne();

  if (education?.instituteImage?.public_id) {
    try {
      await deleteFromCloudinary(education.instituteImage);
    } catch (error) {
      console.error(
        "Error deleting instituteImage in deleteEducation: ",
        error,
      );
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, null, "education deleted successfully!"));
});

const deleteInstituteImage = asynchandler(async (req, res) => {
  const education = req.education;

  const updatedEducation = await Education.findByIdAndUpdate(
    education._id,
    {
      $unset: { instituteImage: "" },
    },
    { new: true },
  );

  if (education?.instituteImage?.public_id) {
    try {
      await deleteFromCloudinary(education.instituteImage);
    } catch (error) {
      console.error(
        "Error deleting instituteImage in deleteInstituteImage: ",
        error,
      );
    }
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedEducation, "instituteImage deleted successfully!"),
    );
});

const getEducation = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.education, "education fetched successfully!"));
});

const getAllEducations = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  const paginatedEducations = await paginateQuery({
    model: Education,
    page,
    limit,
    filter: {
      owner: req.user?._id,
    },
    sort: { sortOrder: 1 },
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

export {
  addEducation,
  updateEducationDetails,
  updateInstituteImage,
  deleteEducation,
  deleteInstituteImage,
  getEducation,
  getAllEducations,
};
