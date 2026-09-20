import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { GENDERS } from "../constants.js";

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required!"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
    },
    middleName: String,
    lastName: String,

    headline: String,
    about: String,

    mobileNo: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
      enum: GENDERS.map((g) => g.value),
    },

    location: {
      country: String,
      state: String,
      city: String,
    },

    documentUrl: String,

    // Couldinary
    image: {
      url: String,
      public_id: String,
      resource_type: String,
    },
    resumeOrCv: {
      url: String,
      public_id: String,
      resource_type: String,
    },

    googleId: String,

    otp: Number,
    otpExpiryDate: Date,

    sessions: [
      {
        refreshToken: {
          type: String,
          required: true,
        },
        userAgent: String,
        ip: String,
        deviceId: String,
        rememberMe: Boolean,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  // ✅ Skip if no password (Google users)
  if (!this.password) return;

  // ✅ Skip if password not modified
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User = model("User", userSchema);
