import mongoose, { Schema, model } from "mongoose";

import { VISIBILITY } from "../constants.js";

const socialPlatformSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    logoUrl: String,

    link: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, "Invalid URL"],
    },
    visibility: {
      type: String,
      enum: VISIBILITY.map((v) => v.value),
      default: "public",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

socialPlatformSchema.index({ owner: 1, name: 1 }, { unique: true });

export const SocialPlatform = model("SocialPlatform", socialPlatformSchema);
