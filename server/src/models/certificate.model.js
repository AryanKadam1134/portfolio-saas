import mongoose, { Schema, model } from "mongoose";

import { VISIBILITY } from "../constants.js";

const certificateSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    issuer: {
      type: String,
      required: true,
    },

    credentialId: String,
    credentialUrl: { type: String, match: [/^https?:\/\/.+/, "Invalid URL"] },

    // Couldinary
    certificateImage: {
      url: String,
      public_id: String,
      resource_type: String,
    },

    issueDate: Date,
    expiryDate: Date,

    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    featured: {
      type: Boolean,
      default: true,
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

export const Certificate = model("Certificate", certificateSchema);
