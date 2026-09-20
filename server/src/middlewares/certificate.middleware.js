import { Certificate } from "../models/certificate.model.js";

import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getCertificateById = asynchandler(async (req, res, next) => {
  const { certificateId } = req.params;

  if (!certificateId) {
    throw new ApiError(400, "certificateId is required!");
  }

  const certificateExists = await Certificate.findById(certificateId);

  if (!certificateExists) {
    throw new ApiError(404, "Certificate not found!");
  }

  if (certificateExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.certificate = certificateExists;

  next();
});
