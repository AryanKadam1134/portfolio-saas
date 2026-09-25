import { UAParser } from "ua-parser-js";

import { User } from "../../models/user.model.js";
import { Skill } from "../../models/skill.model.js";
import { Project } from "../../models/project.model.js";
import { Education } from "../../models/education.model.js";
import { Experience } from "../../models/experience.model.js";
import { Certificate } from "../../models/certificate.model.js";
import { Achievement } from "../../models/achievement.model.js";
import { SkillCategory } from "../../models/skillCategory.model.js";
import { SocialPlatform } from "../../models/socialPlatform.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import { asynchandler } from "../../utils/asynchandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";

const hasPassowrd = asynchandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user?.password && user?.googleId) {
    return res.status(200).json(new ApiRes(200, false, ""));
  } else {
    return res.status(200).json(new ApiRes(200, true, ""));
  }
});

const updateUserDetails = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    username,
    firstName,
    middleName,
    lastName,
    headline,
    about,
    mobileNo,
    gender,
    location,
    documentUrl,
  } = req.body;

  const fields = {};

  if (username) fields.username = username;
  if (firstName) fields.firstName = firstName;
  if (mobileNo) fields.mobileNo = mobileNo;
  if (gender) fields.gender = gender;
  if (location) {
    for (const key in location) {
      fields[`location.${key}`] = location[key];
    }
  }

  // Can be null values
  if (headline !== undefined) fields.headline = headline;
  if (about !== undefined) fields.about = about;
  if (middleName !== undefined) fields.middleName = middleName;
  if (lastName !== undefined) fields.lastName = lastName;
  if (documentUrl !== undefined) fields.documentUrl = documentUrl;

  if (Object.keys(fields).length === 0) {
    throw new ApiError(400, "No fields provided to update!");
  }

  // Check if user exists if username or email is provided
  if (username) {
    const userExists = await User.findOne({
      username,
      _id: { $ne: loggedUserId },
    });

    if (userExists) {
      throw new ApiError(409, "User already exists with similar username");
    }
  }

  if (mobileNo) {
    const userExists = await User.findOne({
      mobileNo,
      _id: { $ne: loggedUserId },
    });

    if (userExists) {
      throw new ApiError(409, "User already exists with same mobile no");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    loggedUserId,
    {
      $set: fields,
    },
    { new: true },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "user details updated successfully!"));
});

const getUserDetails = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.user, "user details fetched successfully!"));
});

const getUserSessions = asynchandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const rawSessions = user?.sessions || [];

  const sessions = rawSessions?.map((session) => {
    const { refreshToken, userAgent, ...sessionData } = session.toObject();
    const parse = new UAParser(userAgent);
    const result = parse.getResult();

    return {
      ...sessionData,
      userAgent: {
        browser: {
          name: result.browser.name || null,
          version: result.browser.version || null,
        },
        device: {
          type: result.device.type || "desktop",
          vendor: result.device.vendor || null,
          model: result.device.model || null,
        },
        os: {
          name: result.os.name || null,
          version: result.os.version || null,
        },
        cpu: {
          architecture: result.cpu.architecture || null,
        },
      },
    };
  });

  if (!sessions.length) {
    throw new ApiError(404, "no sessions found!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, sessions, "user sessions fetched successfully!"));
});

const getUserImage = asynchandler(async (req, res) => {
  const { image } = req.user || {};

  if (image?.url) {
    return res
      .status(200)
      .json(new ApiRes(200, image, "user image fetched successfully!"));
  }

  return res.status(200).json(new ApiRes(200, {}, "couldn't find user image!"));
});

const getUserResume = asynchandler(async (req, res) => {
  const { resumeOrCv } = req.user || {};

  if (resumeOrCv?.url) {
    return res
      .status(200)
      .json(new ApiRes(200, resumeOrCv, "user resume fetched successfully!"));
  }

  return res
    .status(200)
    .json(new ApiRes(200, {}, "couldn't find user resume!"));
});

const updateUserImage = asynchandler(async (req, res) => {
  const loggedUser = req.user;

  const loggedUserId = loggedUser?._id;

  const userImageLocalPath = req.file?.path;

  if (!userImageLocalPath) {
    throw new ApiError(400, "Missing image file path!");
  }

  const updatedImage = await uploadToCloudinary(userImageLocalPath);

  if (!updatedImage?.secure_url) {
    throw new ApiError(500, "Error while updating image on cloudinary!");
  }

  const updatedUser = await User.findByIdAndUpdate(
    loggedUserId,
    {
      $set: {
        image: {
          url: updatedImage?.secure_url,
          public_id: updatedImage?.public_id,
          resource_type: updatedImage?.resource_type,
        },
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  if (loggedUser?.image?.public_id) {
    try {
      await deleteFromCloudinary(loggedUser.image);
    } catch (error) {
      console.error("Error deleting user image in updateUserImage: ", error);
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "user image updated successfully!"));
});

const updateUserResume = asynchandler(async (req, res) => {
  const loggedUser = req.user;

  const loggedUserId = loggedUser?._id;

  const userResumeLocalPath = req.file?.path;

  if (!userResumeLocalPath) {
    throw new ApiError(400, "Missing resumeOrCv file path!");
  }

  const updatedResume = await uploadToCloudinary(userResumeLocalPath);

  if (!updatedResume?.secure_url) {
    throw new ApiError(500, "Error while updating resume on cloudinary!");
  }

  const updatedUser = await User.findByIdAndUpdate(
    loggedUserId,
    {
      $set: {
        resumeOrCv: {
          url: updatedResume?.secure_url,
          public_id: updatedResume?.public_id,
          resource_type: updatedResume?.resource_type,
        },
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  if (loggedUser?.resumeOrCv?.public_id) {
    try {
      await deleteFromCloudinary(loggedUser.resumeOrCv);
    } catch (error) {
      console.error("Error deleting user resume in updateUserResume: ", error);
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "user resume updated successfully!"));
});

const deleteUserImage = asynchandler(async (req, res) => {
  const loggedUser = req.user;

  const updatedUser = await User.findByIdAndUpdate(
    loggedUser?._id,
    {
      $unset: {
        image: "",
      },
    },
    { new: true },
  );

  if (loggedUser?.image?.public_id) {
    try {
      await deleteFromCloudinary(loggedUser.image);
    } catch (error) {
      console.error("Error deleting user image in deleteUserImage: ", error);
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "image deleted successfully!"));
});

const deleteUserResume = asynchandler(async (req, res) => {
  const loggedUser = req.user;

  const updatedUser = await User.findByIdAndUpdate(
    loggedUser?._id,
    {
      $unset: {
        resumeOrCv: "",
      },
    },
    { new: true },
  );

  if (loggedUser?.resumeOrCv?.public_id) {
    try {
      await deleteFromCloudinary(loggedUser.resumeOrCv);
    } catch (error) {
      console.error("Error deleting user resume in deleteUserResume: ", error);
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedUser, "resumeOrCv deleted successfully!"));
});

const deleteUser = asynchandler(async (req, res) => {
  const loggedUser = req.user;
  const loggedUserId = loggedUser?._id;

  const publicIds = [];

  // Delete all related documents without images
  await SocialPlatform.deleteMany({ owner: loggedUserId });
  await Skill.deleteMany({ owner: loggedUserId });
  await SkillCategory.deleteMany({ owner: loggedUserId });

  // Find documents with images before deleting (to collect image public IDs)
  const experiences = await Experience.find({ owner: loggedUserId });
  const educations = await Education.find({ owner: loggedUserId });
  const certificates = await Certificate.find({ owner: loggedUserId });
  const projects = await Project.find({ owner: loggedUserId });
  const achievements = await Achievement.find({ owner: loggedUserId });

  // Now delete all documents from database
  await Experience.deleteMany({ owner: loggedUserId });
  await Education.deleteMany({ owner: loggedUserId });
  await Certificate.deleteMany({ owner: loggedUserId });
  await Project.deleteMany({ owner: loggedUserId });
  await Achievement.deleteMany({ owner: loggedUserId });

  // Collect all public IDs for Cloudinary deletion
  experiences?.forEach((exp) => {
    if (exp?.organizationImage?.public_id) {
      publicIds.push(exp.organizationImage);
    }
  });

  educations?.forEach((edu) => {
    if (edu?.instituteImage?.public_id) {
      publicIds.push(edu.instituteImage);
    }
  });

  certificates?.forEach((cert) => {
    if (cert?.certificateImage?.public_id) {
      publicIds.push(cert.certificateImage);
    }
  });

  projects?.forEach((pro) => {
    if (pro?.projectImages && Array.isArray(pro.projectImages)) {
      pro.projectImages.forEach((img) => {
        if (img?.public_id) {
          publicIds.push(img);
        }
      });
    }
  });

  achievements?.forEach((ach) => {
    if (ach?.achievementImages && Array.isArray(ach.achievementImages)) {
      ach.achievementImages.forEach((img) => {
        if (img?.public_id) {
          publicIds.push(img);
        }
      });
    }
  });

  // Add user's profile image and resume
  if (loggedUser?.image?.public_id) {
    publicIds.push(loggedUser.image);
  }

  if (loggedUser?.resumeOrCv?.public_id) {
    publicIds.push(loggedUser.resumeOrCv);
  }

  // Delete all files from Cloudinary
  try {
    await Promise.all(publicIds.map((image) => deleteFromCloudinary(image)));
  } catch (error) {
    console.error("Error deleting files from Cloudinary:", error);
    // Continue with user deletion even if Cloudinary deletion fails
  }

  // Finally, delete the user document from database
  await User.findByIdAndDelete(loggedUserId);

  return res
    .status(200)
    .json(new ApiRes(200, null, "user account deleted successfully!"));
});

export {
  hasPassowrd,
  updateUserDetails,
  getUserDetails,
  getUserSessions,
  getUserImage,
  getUserResume,
  updateUserImage,
  updateUserResume,
  deleteUserImage,
  deleteUserResume,
  deleteUser,
};
