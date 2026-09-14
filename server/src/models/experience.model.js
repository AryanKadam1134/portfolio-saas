import mongoose, { Schema, model } from "mongoose";

import ApiError from "../utils/ApiError.js";

import { EMPLOYMENT_TYPE, LOCATION_TYPE, VISIBILITY } from "../constants.js";

const positionSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (this.isCurrent && value) return false;
          return true;
        },
        message: "endDate must be null when isCurrent is true",
      },
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const experienceSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    organization: {
      type: String,
      required: true,
    },
    description: String,
    organizationSize: String,
    organizationWebsite: {
      type: String,
      match: [/^https?:\/\/.+/, "Invalid URL"],
    },

    positions: [
      {
        type: positionSchema,
      },
    ],

    latestDate: Date,

    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPE?.map((type) => type.value),
    },

    highlights: [String],
    techStack: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    location: {
      type: String,
    },
    locationType: {
      type: String,
      enum: LOCATION_TYPE?.map((t) => t.value),
      required: true,
    },

    // Couldinary
    organizationImage: {
      url: String,
      public_id: String,
      resource_type: String,
    },

    visibility: {
      type: String,
      enum: VISIBILITY.map((v) => v.value),
      default: "public",
    },
  },
  { timestamps: true },
);

experienceSchema.pre("validate", async function () {
  if (!this.positions || this.positions.length === 0) {
    throw new ApiError(400, "At least one positions is required");
  }

  const presentCount = this.positions.filter((p) => p.isCurrent).length;

  if (presentCount > 1) {
    throw new ApiError(409, "Only one positions can have isCurrent=true");
  }
});

experienceSchema.pre("save", async function () {
  if (!this.positions || this.positions.length === 0) return;

  let latest = null;

  this.positions.forEach((pos) => {
    if (pos.isCurrent) {
      latest = new Date(); // ongoing = most recent
    } else if (pos.endDate) {
      if (!latest || pos.endDate > latest) {
        latest = pos.endDate;
      }
    } else if (pos.startDate) {
      if (!latest || pos.startDate > latest) {
        latest = pos.startDate;
      }
    }
  });

  this.latestDate = latest;
});

export const Experience = model("Experience", experienceSchema);
