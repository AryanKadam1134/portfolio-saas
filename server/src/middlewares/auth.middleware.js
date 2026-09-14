import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

import ApiError from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Access token missing!");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id).select(
    "-password -sessions -googleId -otp -otpExpiryDate",
  );

  if (!user) {
    throw new ApiError(401, "User does not exists!");
  }

  req.user = user;

  next();
});
