import api from "./api.service";

export const experienceEndpoints = {
  addExperience: (body) => api.post(`/experiences`, body),

  updateExperience: (experienceId, body) =>
    api.patch(`/experiences/${experienceId}`, body),

  updateOrganizationImage: (experienceId, body) =>
    api.patch(`/experiences/${experienceId}/organization-image`, body),

  deleteExperience: (experienceId) =>
    api.delete(`/experiences/${experienceId}`),

  deleteOrganizationImage: (experienceId) =>
    api.delete(`/experiences/${experienceId}/organization-image`),

  getExperience: (experienceId) => api.get(`/experiences/${experienceId}`),

  getExperiences: (params) => api.get(`/experiences`, { params }),
};
