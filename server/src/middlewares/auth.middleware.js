import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError(401, "Access token missing!");
  }

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id).select(
    "-password -googleId -otp -otpExpiryDate",
  );

  if (!user) {
    throw new ApiError(401, "User does not exists!");
  }

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing!");
  }

  const sessionExists = user.sessions.some(
    (session) => session.refreshToken === refreshToken,
  );

  if (!sessionExists) {
    throw new ApiError(401, "Session Expired!");
  }

  user.sessions = undefined;
  req.user = user;

  next();
});
