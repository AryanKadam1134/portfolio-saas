import { SocialPlatform } from "../../models/socialPlatform.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import { paginateQuery } from "../../utils/pagination.js";
import { asynchandler } from "../../utils/asynchandler.js";

const manageSocialPlatforms = asynchandler(async (req, res) => {
  const { platforms } = req.body;
  const userId = req.user._id;

  if (!Array.isArray(platforms) || platforms.length === 0) {
    throw new ApiError(400, "No platforms provided!");
  }

  const operations = platforms.map((platform, index) => {
    // ✅ EXISTING PLATFORM → UPDATE
    if (platform._id) {
      return {
        updateOne: {
          filter: {
            _id: platform._id,
            owner: userId,
          },
          update: {
            $set: {
              name: platform.name,
              link: platform.link,
              visibility: platform.visibility,
              sortOrder: platform.sortOrder ?? index,
            },
          },
        },
      };
    }

    // ✅ NEW PLATFORM → INSERT
    return {
      insertOne: {
        document: {
          owner: userId,
          name: platform.name,
          link: platform.link,
          visibility: platform.visibility,
          sortOrder: platform.sortOrder ?? index,
        },
      },
    };
  });

  const result = await SocialPlatform.bulkWrite(operations);

  return res
    .status(200)
    .json(new ApiRes(200, result, "Platforms managed successfully!"));
});

const addSocialPlatform = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { name, logoUrl, link, visibility, sortOrder } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required!");
  }

  if (!link) {
    throw new ApiError(400, "Link is required!");
  }

  const platformExists = await SocialPlatform.findOne({
    owner: loggedUserId,
    name,
  });

  if (platformExists) {
    throw new ApiError(409, "Platform name already exists!");
  }

  const fields = {};

  fields.name = name;
  fields.link = link;
  if (logoUrl !== undefined) fields.logoUrl = logoUrl;
  if (visibility) fields.visibility = visibility;
  if (typeof sortOrder == "number") fields.sortOrder = sortOrder;

  const newSocialPlatform = await SocialPlatform.create({
    owner: loggedUserId,
    ...fields,
  });

  return res
    .status(201)
    .json(
      new ApiRes(
        201,
        newSocialPlatform,
        "Social platform created successfully!",
      ),
    );
});

const updateSocialPlatform = asynchandler(async (req, res) => {
  const socialPlatform = req.socialPlatform;

  const { name, logoUrl, link, visibility, sortOrder } = req.body;

  if (name) {
    const samePlatformName = await SocialPlatform.findOne({
      _id: { $ne: socialPlatform._id },
      owner: socialPlatform?.owner,
      name,
    });

    if (samePlatformName) {
      throw new ApiError(409, "Social platform name already exists!");
    }
  }

  const fields = {};

  if (name) fields.name = name;
  if (link) fields.link = link;
  if (logoUrl !== undefined) fields.logoUrl = logoUrl;
  if (visibility) fields.visibility = visibility;
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  if (Object.keys(fields).length === 0) {
    throw new ApiError(400, "No fields provided to update!");
  }

  const updatedSocialPlatform = await SocialPlatform.findByIdAndUpdate(
    socialPlatform._id,
    {
      $set: fields,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        updatedSocialPlatform,
        "social platform updated successfully!",
      ),
    );
});

const deleteSocialPlatform = asynchandler(async (req, res) => {
  await req.socialPlatform.deleteOne();

  return res
    .status(200)
    .json(new ApiRes(200, null, "social platform deleted successfully!"));
});

const getSocialPlatform = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        req.socialPlatform,
        "social platform fetched successfully!",
      ),
    );
});

const getAllUserSocialPlatforms = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  const skip = (page - 1) * limit;

  // const platforms = await SocialPlatform.find({
  //   owner: req.user?._id,
  // }).sort({ sortOrder: 1 });

  const paginatedPlatforms = await paginateQuery({
    model: SocialPlatform,
    page,
    limit,
    filter: {
      owner: req.user?._id,
    },
    sort: { sortOrder: 1 },
  });

  if (paginatedPlatforms?.length <= 0) {
    return res.status(200).json(new ApiRes(200, [], "no platforms found!"));
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, paginatedPlatforms, "platforms fetched successfully!"),
    );
});

export {
  manageSocialPlatforms,
  addSocialPlatform,
  getSocialPlatform,
  updateSocialPlatform,
  deleteSocialPlatform,
  getAllUserSocialPlatforms,
};
