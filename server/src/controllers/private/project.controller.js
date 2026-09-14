import { Project } from "../../models/project.model.js";
import { Experience } from "../../models/experience.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import asynchandler from "../../utils/asynchandler.js";
import { parseBoolean } from "../../utils/parseBoolean.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import { paginateQuery } from "../../utils/paginatedQuery.js";

const addProject = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    title,
    description,
    startDate,
    endDate,
    isCurrent,
    featured,
    githubLink,
    liveLink,
    category,
    techStack,
    visibility,
    sortOrder,
    organizationId,
  } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required!");
  }

  const projectExists = await Project.findOne({
    owner: loggedUserId,
    title,
  });

  if (projectExists) {
    throw new ApiError(409, "Project name already exists!");
  }

  const fields = {};

  fields.title = title;

  if (description) fields.description = description;
  if (startDate) fields.startDate = startDate;
  if (endDate) fields.endDate = endDate;
  if (githubLink) fields.githubLink = githubLink;
  if (liveLink) fields.liveLink = liveLink;
  if (category) fields.category = category;
  if (visibility) fields.visibility = visibility;

  if (techStack?.length > 0)
    fields.techStack = Array.isArray(techStack)
      ? techStack
      : JSON.parse(techStack);

  if (isCurrent !== undefined) fields.isCurrent = parseBoolean(isCurrent);
  if (featured !== undefined) fields.featured = parseBoolean(featured);
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  // Check if Organization exists
  if (organizationId) {
    const organizationExists = await Experience.findById(organizationId);

    if (!organizationExists) {
      throw new ApiError(404, "Organization not found!");
    }

    fields.organizationId = organizationId;
  }

  const projectImages = req.files;

  let uploadedProjectImages;

  if (projectImages?.length > 0)
    uploadedProjectImages = await Promise.all(
      projectImages?.map((image) => uploadToCloudinary(image?.path)),
    );

  if (uploadedProjectImages?.length > 0) {
    fields.projectImages = uploadedProjectImages?.map((image) => ({
      url: image?.secure_url,
      public_id: image?.public_id,
      resource_type: image?.resource_type,
    }));
  }

  const createdProject = await Project.create({
    owner: loggedUserId,
    ...fields,
    coverImageIndex: 0,
  });

  return res
    .status(201)
    .json(new ApiRes(201, createdProject, "Project created successfully!"));
});

const updateProjectDetails = asynchandler(async (req, res) => {
  const project = req.project;

  const {
    title,
    description,
    startDate,
    endDate,
    isCurrent,
    featured,
    githubLink,
    liveLink,
    category,
    techStack,
    visibility,
    sortOrder,
    organizationId,
    coverImageIndex,
  } = req.body;

  if (title) {
    const sameProjectName = await Project.findOne({
      _id: { $ne: project._id },
      owner: project?.owner,
      title,
    });

    if (sameProjectName) {
      throw new ApiError(409, "Project name already exists!");
    }
  }

  const fields = {};

  if (title) fields.title = title;
  if (visibility) fields.visibility = visibility;

  // Can be null values
  if (description !== undefined) fields.description = description;
  if (startDate !== undefined) fields.startDate = startDate;
  if (endDate !== undefined) fields.endDate = endDate;
  if (githubLink !== undefined) fields.githubLink = githubLink;
  if (liveLink !== undefined) fields.liveLink = liveLink;
  if (category !== undefined) fields.category = category;

  if (techStack !== undefined)
    fields.techStack = Array.isArray(techStack)
      ? techStack
      : JSON.parse(techStack);

  if (isCurrent !== undefined) fields.isCurrent = parseBoolean(isCurrent);
  if (featured !== undefined) fields.featured = parseBoolean(featured);
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  // Check if Organization exists (can be null)
  if (organizationId !== undefined) {
    const organizationExists = await Experience.findById(organizationId);

    // if null do not throw error
    if (organizationId && !organizationExists) {
      throw new ApiError(404, "Organization not found!");
    }

    fields.organizationId = organizationId;
  }

  if (coverImageIndex !== undefined) {
    const index = coverImageIndex;

    if (index < 0 || index >= project.projectImages.length) {
      throw new ApiError(400, "Invalid cover image index");
    }

    fields.coverImageIndex = index;
  }

  Object.assign(project, fields);

  const updatedProject = await project.save();

  return res
    .status(200)
    .json(new ApiRes(200, updatedProject, "Project updated successfully!"));
});

const updateProjectImages = asynchandler(async (req, res) => {
  const project = req.project;

  const newImages = req.files;

  if (project?.projectImages?.length + newImages?.length > 5) {
    throw new ApiError(400, "Maximum 5 project images are allowed");
  }

  const uploadedProjectImages = await Promise.all(
    newImages?.map((image) => uploadToCloudinary(image?.path)),
  );

  if (uploadedProjectImages?.length === 0) {
    throw new ApiError(502, "Upload failed!");
  }

  const formattedImages = uploadedProjectImages?.map((image) => ({
    url: image?.secure_url,
    public_id: image?.public_id,
    resource_type: image?.resource_type,
  }));

  const updatedProject = await Project.findByIdAndUpdate(
    project._id,
    {
      $push: {
        projectImages: {
          $each: formattedImages,
        },
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedProject, "Project images updated successfully!"),
    );
});

const deleteProject = asynchandler(async (req, res) => {
  const project = req.project;

  await Project.findByIdAndDelete(project._id);

  try {
    if (project?.projectImages?.length > 0)
      await Promise.all(
        project.projectImages?.map((image) => deleteFromCloudinary(image)),
      );
  } catch (error) {
    console.error("Error deleting projectImages in deleteProject: ", error);
  }

  return res
    .status(200)
    .json(new ApiRes(200, null, "Project deleted successfully!"));
});

const deleteProjectImage = asynchandler(async (req, res) => {
  const project = req.project;
  const { imagePublicId } = req.params;

  if (!imagePublicId) {
    throw new ApiError(400, "imagePublicId is required!");
  }

  // 🔍 Find index of image to delete
  const deleteIndex = project.projectImages.findIndex(
    (img) => img.public_id === imagePublicId,
  );

  if (deleteIndex === -1) {
    throw new ApiError(404, "Image not found!");
  }

  const imageToDelete = project.projectImages[deleteIndex];

  // 🧠 Adjust coverImageIndex
  let newCoverIndex = project.coverImageIndex;

  if (deleteIndex === project.coverImageIndex) {
    // If cover image is deleted → fallback
    newCoverIndex = 0;
  } else if (deleteIndex < project.coverImageIndex) {
    // Shift left
    newCoverIndex -= 1;
  }

  // 🗑 Remove image
  project.projectImages.splice(deleteIndex, 1);

  // 🧨 Edge case: no images left
  if (project.projectImages.length === 0) {
    newCoverIndex = null;
  }

  project.coverImageIndex = newCoverIndex;

  await project.save();

  // ☁️ Delete from Cloudinary
  try {
    await deleteFromCloudinary(imageToDelete);
  } catch (error) {
    console.error("Error deleting projectImage in deleteProjectImage: ", error);
  }

  return res
    .status(200)
    .json(new ApiRes(200, project, "Project image deleted successfully!"));
});

const getProject = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.project, "Project fetched successfully!"));
});

const getAllProjects = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  const paginatedProjects = await paginateQuery({
    model: Project,
    page,
    limit,
    filter: {
      owner: req.user?._id,
    },
    sort: { sortOrder: 1 },
  });

  if (paginatedProjects?.data?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, paginatedProjects, "No projects found!"));
  }

  return res
    .status(200)
    .json(new ApiRes(200, paginatedProjects, "Projects fetched successfully!"));
});

export {
  addProject,
  updateProjectDetails,
  updateProjectImages,
  deleteProject,
  deleteProjectImage,
  getProject,
  getAllProjects,
};
