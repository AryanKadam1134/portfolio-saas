import api from "./api.service";

export const filterEndpoints = {
  getSkillCategoriesList: () => api.get(`/filters/skill-categories`),

  getOrganizationsList: () => api.get(`/filters/organizations`),

  getProjectCategoriesList: () => api.get(`/filters/project-categories`),

  getSkillsList: () => api.get(`/filters/skills`),

  getCertificatesList: () => api.get(`/filters/certificates`),

  getSkillLevels: () => api.get(`/filters/skill-levels`),

  getGenders: () => api.get(`/filters/genders`),

  getEmploymentTypes: () => api.get(`/filters/employment-types`),

  getLocationTypes: () => api.get(`/filters/location-types`),

  getVisibilities: () => api.get(`/filters/visibility`),
};
