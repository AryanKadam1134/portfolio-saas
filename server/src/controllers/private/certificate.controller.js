import { Certificate } from "../../models/certificate.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import asynchandler from "../../utils/asynchandler.js";
import { parseBoolean } from "../../utils/parseBoolean.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import { paginateQuery } from "../../utils/paginatedQuery.js";

const addCertificate = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    title,
    issuer,
    certificateUrl,
    credentialId,
    credentialUrl,
    issueDate,
    expiryDate,
    skills,
    featured,
    visibility,
    sortOrder,
  } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required!");
  }

  if (!issuer) {
    throw new ApiError(400, "Issuer is required!");
  }

  const certificateExists = await Certificate.findOne({
    owner: loggedUserId,
    title,
  });

  if (certificateExists) {
    throw new ApiError(409, "Certificate already exists!");
  }

  const fields = {};

  fields.title = title;
  fields.issuer = issuer;

  if (certificateUrl) fields.certificateUrl = certificateUrl;

  if (credentialId) fields.credentialId = credentialId;
  if (credentialUrl) fields.credentialUrl = credentialUrl;

  if (issueDate) fields.issueDate = issueDate;
  if (expiryDate) fields.expiryDate = expiryDate;

  if (visibility) fields.visibility = visibility;

  if (skills?.length > 0)
    fields.skills = Array.isArray(skills) ? skills : JSON.parse(skills);

  if (featured !== undefined) fields.featured = parseBoolean(featured);
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  let uploadedCertificateImage;

  const certificateImage = req.file?.path;

  if (certificateImage)
    uploadedCertificateImage = await uploadToCloudinary(certificateImage);

  if (uploadedCertificateImage?.secure_url) {
    fields.certificateImage = {
      url: uploadedCertificateImage?.secure_url,
      public_id: uploadedCertificateImage?.public_id,
      resource_type: uploadedCertificateImage?.resource_type,
    };
  }

  const createdCertificate = await Certificate.create({
    owner: loggedUserId,
    ...fields,
  });

  return res
    .status(201)
    .json(
      new ApiRes(201, createdCertificate, "certificate created successfully!"),
    );
});

const updateCertificate = asynchandler(async (req, res) => {
  const certificate = req.certificate;

  const {
    title,
    issuer,
    certificateUrl,
    credentialId,
    credentialUrl,
    issueDate,
    expiryDate,
    skills,
    featured,
    visibility,
    sortOrder,
  } = req.body;

  if (title) {
    const sameCertificateTitle = await Certificate.findOne({
      _id: { $ne: certificate._id },
      owner: certificate.owner,
      title,
    });

    if (sameCertificateTitle) {
      throw new ApiError(409, "Certificate title already exists!");
    }
  }

  const fields = {};

  if (title) fields.title = title;
  if (issuer) fields.issuer = issuer;

  if (certificateUrl) fields.certificateUrl = certificateUrl;

  if (visibility) fields.visibility = visibility;

  if (credentialId !== undefined) fields.credentialId = credentialId;
  if (credentialUrl !== undefined) fields.credentialUrl = credentialUrl;

  if (issueDate !== undefined) fields.issueDate = issueDate;
  if (expiryDate !== undefined) fields.expiryDate = expiryDate;

  if (skills !== undefined)
    fields.skills = Array.isArray(skills) ? skills : JSON.parse(skills);

  if (featured !== undefined) fields.featured = parseBoolean(featured);
  if (sortOrder !== undefined) fields.sortOrder = Number(sortOrder);

  Object.assign(certificate, fields);

  const updatedCertificate = await certificate.save();

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedCertificate, "certificate updated successfully!"),
    );
});

const updateCertificateImage = asynchandler(async (req, res) => {
  const certificate = req.certificate;

  const certificateImage = req.file?.path;

  if (!certificateImage) {
    throw new ApiError(400, "Missing image file path!");
  }

  const updatedImage = await uploadToCloudinary(certificateImage);

  if (!updatedImage?.secure_url) {
    throw new ApiError(500, "Error while updating image on cloudinary!");
  }

  const updatedCertificate = await Certificate.findByIdAndUpdate(
    certificate.id,
    {
      $set: {
        certificateImage: {
          url: updatedImage?.secure_url,
          public_id: updatedImage?.public_id,
          resource_type: updatedImage?.resource_type,
        },
      },
    },
    { new: true },
  );

  if (certificate?.certificateImage?.public_id) {
    try {
      await deleteFromCloudinary(certificate.certificateImage);
    } catch (error) {
      console.error(
        "Error deleting certificateImage in updateCertificateImage: ",
        error,
      );
    }
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        updatedCertificate,
        "certificateImage updated successfully!",
      ),
    );
});

const deleteCertificate = asynchandler(async (req, res) => {
  const certificate = req.certificate;

  await certificate.deleteOne();

  if (certificate?.certificateImage?.public_id) {
    try {
      await deleteFromCloudinary(certificate.certificateImage);
    } catch (error) {
      console.error(
        "Error deleting certificateImage in deleteCertificate: ",
        error,
      );
    }
  }

  return res
    .status(200)
    .json(new ApiRes(200, null, "certificate deleted successfully!"));
});

const deleteCertificateImage = asynchandler(async (req, res) => {
  const certificate = req.certificate;

  const upatedCertificate = await Certificate.findByIdAndUpdate(
    certificate._id,
    {
      $unset: { certificateImage: "" },
    },
    { new: true },
  );

  if (certificate?.certificateImage?.public_id) {
    try {
      await deleteFromCloudinary(certificate.certificateImage);
    } catch (error) {
      console.error(
        "Error deleting certificateImage in deleteOrganiaztionImage: ",
        error,
      );
    }
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        upatedCertificate,
        "certificateImage deleted successfully!",
      ),
    );
});

const getCertificate = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiRes(200, req.certificate, "certificate fetched successfully!"),
    );
});

const getAllCertificates = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  const paginatedCertificates = await paginateQuery({
    model: Certificate,
    page,
    limit,
    filter: {
      owner: req.user?._id,
    },
    sort: { sortOrder: 1 },
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

export {
  addCertificate,
  updateCertificate,
  updateCertificateImage,
  deleteCertificate,
  deleteCertificateImage,
  getCertificate,
  getAllCertificates,
};
