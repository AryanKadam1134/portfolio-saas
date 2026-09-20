import { Certificate } from "../../models/certificate.model.js";
import { Achievement } from "../../models/achievement.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import { paginateQuery } from "../../utils/pagination.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { parseBoolean } from "../../utils/parseBoolean.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";

const addAchievement = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    title,
    description,
    issuer,
    link,
    location,
    date,
    featured,
    visibility,
    sortOrder,
    certificateId,
  } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required!");
  }

  const achievementExists = await Achievement.findOne({
    owner: loggedUserId,
    title,
  });

  if (achievementExists) {
    throw new ApiError(409, "Achievement name already exists!");
  }

  const fields = {};

  fields.title = title;

  if (description) fields.description = description;
  if (date) fields.date = date;
  if (issuer) fields.issuer = issuer;
  if (link) fields.link = link;
  if (location) fields.location = location;
  if (visibility) fields.visibility = visibility;

  if (featured !== undefined) fields.featured = parseBoolean(featured);
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  // Check if Certificate exists
  if (certificateId) {
    const certificateExists = await Certificate.findById(certificateId);

    if (!certificateExists) {
      throw new ApiError(404, "Certificate not found!");
    }

    fields.certificateId = certificateId;
  }

  const achievementImages = req.files;

  let uploadedImages;

  if (achievementImages?.length > 0)
    uploadedImages = await Promise.all(
      achievementImages?.map((image) => uploadToCloudinary(image?.path)),
    );

  if (uploadedImages?.length > 0) {
    fields.achievementImages = uploadedImages?.map((image) => ({
      url: image?.secure_url,
      public_id: image?.public_id,
      resource_type: image?.resource_type,
    }));
  }

  const createdAchievement = await Achievement.create({
    owner: loggedUserId,
    ...fields,
    coverImageIndex: 0,
  });

  return res
    .status(201)
    .json(
      new ApiRes(201, createdAchievement, "achievement created successfully!"),
    );
});

const updateAchievement = asynchandler(async (req, res) => {
  const achievement = req.achievement;

  const {
    title,
    description,
    issuer,
    link,
    location,
    date,
    featured,
    visibility,
    sortOrder,
    certificateId,
    coverImageIndex,
  } = req.body;

  if (title) {
    const sameAchievementName = await Achievement.findOne({
      _id: { $ne: achievement._id },
      owner: achievement?.owner,
      title,
    });

    if (sameAchievementName) {
      throw new ApiError(409, "Achievement name already exists!");
    }
  }

  const fields = {};

  if (title) fields.title = title;
  if (visibility) fields.visibility = visibility;

  // Can be null values
  if (description !== undefined) fields.description = description;
  if (date !== undefined) fields.date = date;
  if (issuer !== undefined) fields.issuer = issuer;
  if (link !== undefined) fields.link = link;
  if (location !== undefined) fields.location = location;

  if (featured !== undefined) fields.featured = parseBoolean(featured);
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  // Check if Certificate exists (can be null)
  if (certificateId !== undefined) {
    const certificateExists = await Certificate.findById(certificateId);

    // if null do not throw error
    if (certificateId && !certificateExists) {
      throw new ApiError(404, "Certificate not found!");
    }

    fields.certificateId = certificateId;
  }

  if (coverImageIndex !== undefined) {
    const index = coverImageIndex;

    if (index < 0 || index >= achievement.achievementImages.length) {
      throw new ApiError(400, "Invalid cover image index");
    }

    fields.coverImageIndex = index;
  }

  Object.assign(achievement, fields);

  const updatedAchievement = await achievement.save();

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedAchievement, "achievement updated successfully!"),
    );
});

const updateAchievementImages = asynchandler(async (req, res) => {
  const achievement = req.achievement;

  const newImages = req.files;

  if (achievement?.achievementImages?.length + newImages?.length > 5) {
    throw new ApiError(400, "Maximum 5 achievement images are allowed");
  }

  const uploadedAchievementImages = await Promise.all(
    newImages?.map((image) => uploadToCloudinary(image?.path)),
  );

  if (uploadedAchievementImages?.length === 0) {
    throw new ApiError(502, "Upload failed!");
  }

  const formattedImages = uploadedAchievementImages?.map((image) => ({
    url: image?.secure_url,
    public_id: image?.public_id,
    resource_type: image?.resource_type,
  }));

  const updatedAchievement = await Achievement.findByIdAndUpdate(
    achievement._id,
    {
      $push: {
        achievementImages: {
          $each: formattedImages,
        },
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        updatedAchievement,
        "achievement images updated successfully!",
      ),
    );
});

const deleteAchievement = asynchandler(async (req, res) => {
  const achievement = req.achievement;

  await Achievement.findByIdAndDelete(achievement._id);

  try {
    if (achievement?.achievementImages?.length > 0)
      await Promise.all(
        achievement.achievementImages?.map((image) =>
          deleteFromCloudinary(image),
        ),
      );
  } catch (error) {
    console.error(
      "Error deleting achievementImages in deleteAchievement: ",
      error,
    );
  }

  return res
    .status(200)
    .json(new ApiRes(200, null, "achievement deleted successfully!"));
});

const deleteAchievementImage = asynchandler(async (req, res) => {
  const achievement = req.achievement;
  const { imagePublicId } = req.params;

  if (!imagePublicId) {
    throw new ApiError(400, "imagePublicId is required!");
  }

  // 🔍 Find index of image to delete
  const deleteIndex = achievement.achievementImages.findIndex(
    (img) => img.public_id === imagePublicId,
  );

  if (deleteIndex === -1) {
    throw new ApiError(404, "Image not found!");
  }

  const imageToDelete = achievement.achievementImages[deleteIndex];

  // 🧠 Adjust coverImageIndex
  let newCoverIndex = achievement.coverImageIndex;

  if (deleteIndex === achievement.coverImageIndex) {
    // If cover image is deleted → fallback
    newCoverIndex = 0;
  } else if (deleteIndex < achievement.coverImageIndex) {
    // Shift left
    newCoverIndex -= 1;
  }

  // 🗑 Remove image
  achievement.achievementImages.splice(deleteIndex, 1);

  // 🧨 Edge case: no images left
  if (achievement.achievementImages.length === 0) {
    newCoverIndex = null;
  }

  achievement.coverImageIndex = newCoverIndex;

  await achievement.save();

  // ☁️ Delete from Cloudinary
  try {
    await deleteFromCloudinary(imageToDelete);
  } catch (error) {
    console.error(
      "Error deleting achievementImage in deleteAchievementImage: ",
      error,
    );
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, achievement, "achievement image deleted successfully!"),
    );
});

const getAchievement = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiRes(200, req.achievement, "achievement fecthed successfully!"),
    );
});

const getAllAchievement = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  const paginatedAchievements = await paginateQuery({
    model: Achievement,
    page,
    limit,
    filter: {
      owner: req.user?._id,
    },
    sort: { sortOrder: 1 },
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
  addAchievement,
  updateAchievement,
  updateAchievementImages,
  deleteAchievement,
  deleteAchievementImage,
  getAchievement,
  getAllAchievement,
};
