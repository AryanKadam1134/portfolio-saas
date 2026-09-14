const isProduction = process.env.NODE_ENV === "production";

const SOCIAL_PLATFORMS = [
  { label: "GitHub", value: "github" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Twitter", value: "twitter" },
  { label: "LeetCode", value: "leetcode" },
  { label: "Instagram", value: "instagram" },
];

const SKILL_LEVEL = [
  { label: "Basic", value: "basic" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advance", value: "advance" },
];

const GENDERS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const PROJECT_CATEGORIES = [
  { label: "Personal", value: "personal" },
  { label: "Freelance", value: "freelance" },
  { label: "Hackathon", value: "hackathon" },
  { label: "Client", value: "client" },
  { label: "Open Source", value: "open-source" },
];

const EMPLOYMENT_TYPE = [
  { label: "Full Time", value: "full-time" },
  { label: "Part Time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Freelance", value: "freelance" },
  { label: "Internship", value: "internship" },
  { label: "Apprenticeship", value: "apprenticeship" },
];

const LOCATION_TYPE = [
  { label: "On Site", value: "on-site" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];

const VISIBILITY = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
];

const COOKIE_OPTIONS = {
  httpOnly: true, // set to true in production
  secure: isProduction ? true : false,
  sameSite: isProduction ? "none" : "strict",
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction ? true : false, // set to true in production
  sameSite: isProduction ? "none" : "strict",
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction ? true : false, // true in production (HTTPS)
  sameSite: isProduction ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
};

export {
  SOCIAL_PLATFORMS,
  SKILL_LEVEL,
  GENDERS,
  PROJECT_CATEGORIES,
  EMPLOYMENT_TYPE,
  LOCATION_TYPE,
  VISIBILITY,
  isProduction,
  COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
};
