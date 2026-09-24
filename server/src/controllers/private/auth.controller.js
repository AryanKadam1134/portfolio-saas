import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { User } from "../../models/user.model.js";

import ApiRes from "../../utils/ApiRes.js";
import ApiError from "../../utils/ApiError.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { shootEmail } from "../../utils/resendMailShooter.js";
import {
  welcomeUserTemplate,
  resetPasswordOTPTemplate,
  passwordChangedTemplate,
} from "../../utils/emailTemplates.js";

import {
  COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../../constants.js";

const shooterEmail = process.env.SHOOTER_EMAIL;

const generateAccessAndRefreshToken = async (userId, req) => {
  if (!userId) return;

  const deviceId = req.headers["x-device-id"];

  if (!deviceId) {
    throw new ApiError(400, "Device ID missing");
  }

  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const createdAt = new Date();

  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log("accessToken: ", accessToken);
    // console.log("refreshToken: ", refreshToken);

    const sessions = user?.sessions ?? [];

    // add new session
    const existingSessionIndex = sessions.findIndex(
      (s) => s.deviceId === deviceId,
    );

    // ✅ CASE 1: Device already exists → UPDATE session
    if (existingSessionIndex !== -1) {
      const session = sessions[existingSessionIndex];
      session.refreshToken = refreshToken;
      session.userAgent = userAgent;
      session.ip = ip;
      session.createdAt = createdAt;
    }
    // ✅ CASE 2: New device
    else {
      const newSession = {
        deviceId,
        refreshToken,
        rememberMe: req.body?.rememberMe ?? false,
        userAgent,
        ip,
        createdAt,
      };

      if (sessions?.length < 5) {
        sessions.push(newSession);
      }
      // 5 sessions → try to replace a non-remembered session
      else {
        const replaceableSessionIndex = sessions.findIndex(
          (session) => session?.rememberMe === false,
        );

        // All 5 sessions are remembered → reject
        if (replaceableSessionIndex === -1) {
          throw new ApiError(429, "Maximum devices limit reached (5)");
        }

        sessions[replaceableSessionIndex] = newSession;
      }
    }

    user.sessions = sessions;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error Generating Access or Refresh Token: ", error);
    throw new ApiError(error?.statusCode, error?.message);
  }
};

const googleAuth = asynchandler(async (req, res) => {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  const { code, rememberMe } = req.body;

  const deviceId = req.headers["x-device-id"];
  if (!deviceId) {
    throw new ApiError(400, "Device ID missing");
  }

  console.log("Auth Code: ", code);

  if (!code) {
    throw new ApiError(400, "Google authorization code missing");
  }

  const { tokens } = await client.getToken(code);

  console.log("tokens: ", tokens);

  if (!tokens.id_token) {
    throw new ApiError(400, "Google ID token missing");
  }

  // ✅ Verify token from Google
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  console.log("ticket: ", ticket);

  const payload = ticket.getPayload();

  console.log("payload: ", payload);

  const { email, given_name, family_name, picture, sub } = payload;

  if (!email) {
    throw new ApiError(400, "Google account has no email");
  }

  // ✅ Check if user exists
  let user = await User.findOne({ email });

  // ✅ CASE 1: New user → Register
  if (!user) {
    user = await User.create({
      firstName: given_name || "User",
      lastName: family_name || "",
      username: email.split("@")[0] + "_" + Date.now(), // unique username
      email,
      password: undefined, // IMPORTANT: no password
      googleId: sub,
    });

    // Send email in background (don't await)
    shootEmail({
      to: user.email,
      subject: "Welcome to Portfolio SaaS",
      html: welcomeUserTemplate(user),
    }).catch((error) => {
      console.error(
        "Background: Error sending mail in googleAuth:",
        error.message,
      );
    });
  }

  // ✅ CASE 2: Existing user but no googleId → link account
  if (!user.googleId) {
    user.googleId = sub;
    await user.save({ validateBeforeSave: false });
  }

  // ✅ Generate tokens using YOUR system
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
    req,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Couldn't generate tokens");
  }

  const loggedUser = await User.findById(user._id).select(
    "-password -sessions",
  );

  // ✅ SAME cookie logic as your login
  return res
    .status(200)
    .cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
    .cookie(
      "refreshToken",
      refreshToken,
      rememberMe ? REFRESH_TOKEN_COOKIE_OPTIONS : COOKIE_OPTIONS,
    )
    .json(new ApiRes(200, { user: loggedUser }, "Google login successful!"));
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const cookieRefreshToken = req.cookies?.refreshToken;

  const deviceId = req.headers["x-device-id"];

  if (!cookieRefreshToken) {
    throw new ApiError(401, "No refresh token");
  }

  if (!deviceId) {
    throw new ApiError(400, "Device ID missing");
  }

  // Decode Token
  const decodedToken = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const loggedUser = await User.findById(decodedToken?._id);

  if (!loggedUser) {
    throw new ApiError(404, "User not found!");
  }

  const session = loggedUser.sessions.find((s) => s.deviceId === deviceId);

  if (!session) {
    throw new ApiError(401, "Session expired!");
  }

  const rememberMe = session.rememberMe;

  // Get access and referesh Token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    loggedUser?._id,
    req,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(503, "Couldn't generate access or refresh token!");
  }

  const user = await User.findById(loggedUser._id).select(
    "-password -sessions -googleId -otp -otpExpiryDate",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
    .cookie(
      "refreshToken",
      refreshToken,
      rememberMe ? REFRESH_TOKEN_COOKIE_OPTIONS : COOKIE_OPTIONS,
    )
    .json(
      new ApiRes(
        200,
        { user, accessToken, refreshToken },
        "session revived successfully!",
      ),
    );
});

const registerUser = asynchandler(async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (
    [firstName, username, email, password].some(
      (field) => typeof field == "string" && field?.trim() == "",
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new ApiError(
      409,
      "user already exist with similar username or email!",
    );
  }

  const newUser = await User.create({
    firstName,
    lastName,
    username: username?.toLowerCase(),
    email,
    password,
  });

  // Send email in background (don't await)
  shootEmail({
    to: newUser.email,
    subject: "Welcome to Portfolio SaaS",
    html: welcomeUserTemplate(newUser),
  }).catch((error) => {
    console.error(
      "Background: Error sending mail in registerUser:",
      error.message,
    );
  });

  return res
    .status(201)
    .json(new ApiRes(201, {}, "user created successfully!"));
});

const loginUser = asynchandler(async (req, res) => {
  const { userCredential, password, rememberMe } = req.body;

  if (!userCredential) {
    throw new ApiError(400, "Username or email is required!");
  }

  if (!password) {
    throw new ApiError(400, "Password is required!");
  }

  const userExist = await User.findOne({
    $or: [{ username: userCredential }, { email: userCredential }],
  });

  if (!userExist) {
    throw new ApiError(404, "User not found!");
  }

  const isPasswordCorrect = await userExist.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userExist?._id,
    req,
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(503, "Couldn't generate access or refresh token!");
  }

  const loggedUser = await User.findById(userExist?._id).select(
    "-password -refreshToken -sessions",
  );

  if (!loggedUser) {
    throw new ApiError(500, "Error logging in user!");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
    .cookie(
      "refreshToken",
      refreshToken,
      rememberMe ? REFRESH_TOKEN_COOKIE_OPTIONS : COOKIE_OPTIONS,
    )
    .json(
      new ApiRes(200, { user: loggedUser }, "user logged in successfully!"),
    );
});

const logoutUser = asynchandler(async (req, res) => {
  const cookieRefreshToken = req.cookies?.refreshToken;

  await User.findByIdAndUpdate(req.user?._id, {
    $pull: { sessions: { refreshToken: cookieRefreshToken } },
  });

  return res
    .status(204)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .clearCookie("refreshToken", COOKIE_OPTIONS)
    .json(new ApiRes(204, "user logged out successfully!"));
});

const removeSession = asynchandler(async (req, res) => {
  const userId = req.user?._id;
  const { sessionId } = req.body;
  const cookieRefreshToken = req.cookies?.refreshToken;

  if (!sessionId) {
    throw new ApiError(400, "sessionId is required!");
  }

  const user = await User.findById(userId);

  const currentSession = user?.sessions?.find(
    (session) => session?.refreshToken === cookieRefreshToken,
  );

  if (!currentSession) {
    throw new ApiError(401, "Current session not found!");
  }

  const isCurrentSession = currentSession?._id.toString() === sessionId;

  await User.findByIdAndUpdate(userId, {
    $pull: { sessions: { _id: sessionId } },
  });

  if (isCurrentSession) {
    return res
      .status(200)
      .clearCookie("accessToken", COOKIE_OPTIONS)
      .clearCookie("refreshToken", COOKIE_OPTIONS)
      .json(
        new ApiRes(200, { isCurrentSession }, "user logged out successfully!"),
      );
  }

  return res
    .status(200)
    .json(new ApiRes(200, {}, "user session logged out successfully!"));
});

const changePassword = asynchandler(async (req, res) => {
  const { isInitializing, old_password, new_password, confirm_password } =
    req.body;

  const loggedUser = await User.findById(req.user?._id);

  if (!isInitializing) {
    if (!old_password || !new_password || !confirm_password) {
      throw new ApiError(400, "All fields are required!");
    }

    // Validate password confirmation match
    if (new_password !== confirm_password) {
      throw new ApiError(
        400,
        "Passwords do not match! Please ensure new password and confirm password are the same.",
      );
    }

    const isPasswordCorrect = await loggedUser.isPasswordCorrect(old_password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid current password!");
    }

    if (new_password === old_password) {
      throw new ApiError(
        400,
        "New password cannot be the same as old password!",
      );
    }
  }

  loggedUser.password = new_password;
  await loggedUser.save({ validateBeforeSave: false });

  // Send email in background (don't await)
  shootEmail({
    to: loggedUser.email,
    subject: "Your Password Was Changed Successfully 🔐",
    html: passwordChangedTemplate(loggedUser),
  }).catch((error) => {
    console.error(
      "Background: Error sending mail in changePassword:",
      error.message,
    );
  });

  return res
    .status(200)
    .json(new ApiRes(200, null, "Password changed successfully!"));
});

const forgotPassword = asynchandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  user.otp = otp;
  user.otpExpiryDate = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send email in background (don't await)
  shootEmail({
    to: user.email,
    subject: "Reset Password OTP",
    html: resetPasswordOTPTemplate(user, otp),
  }).catch((error) => {
    console.error("Background: Error sending OTP email:", error.message);
  });

  return res.status(200).json(new ApiRes(200, null, "OTP sent to your email!"));
});

const verifyOTP = asynchandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (user.otp !== Number(otp) || user.otpExpiryDate < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP!");
  }

  return res.status(200).json(new ApiRes(200, null, "OTP verified!"));
});

const resetPassword = asynchandler(async (req, res) => {
  const { email, new_password, confirm_password } = req.body;

  if (!new_password || !confirm_password) {
    throw new ApiError(400, "New password is required!");
  }

  if (new_password !== confirm_password) {
    throw new ApiError(400, "Password do not match!");
  }

  const user = await User.findOne({ email });

  const isPasswordCorrect = await user.isPasswordCorrect(new_password);

  if (isPasswordCorrect) {
    throw new ApiError(409, "New password cannot be same as old password!");
  }

  user.password = new_password;
  await user.save({ validateBeforeSave: false });

  // Send email in background (don't await)
  shootEmail({
    to: user.email,
    subject: "Your Password Was Changed Successfully 🔐",
    html: passwordChangedTemplate(user),
  }).catch((error) => {
    console.error(
      "Background: Error sending password reset email:",
      error.message,
    );
  });

  return res
    .status(200)
    .json(new ApiRes(200, null, "Password changed successfully!"));
});

export {
  googleAuth,
  registerUser,
  loginUser,
  logoutUser,
  removeSession,
  refreshAccessToken,
  changePassword,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
