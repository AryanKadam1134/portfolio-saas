import { Router } from "express";

import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

import {
  changePassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  googleAuth,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../../controllers/private/auth.controller.js";

const authRouter = Router();

authRouter.route("/google").post(googleAuth);

authRouter.route("/register").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "resumeOrCv",
      maxCount: 1,
    },
  ]),
  registerUser,
);

authRouter.route("/login").post(loginUser);

authRouter.route("/logout").post(verifyJWT, logoutUser);

authRouter.route("/password").patch(verifyJWT, changePassword);

authRouter.route("/forgot-password").post(forgotPassword);

authRouter.route("/verify-otp").post(verifyOTP);

authRouter.route("/reset-password").patch(resetPassword);

authRouter.route("/restoreSession").post(refreshAccessToken);

export default authRouter;
