import api from "./api.service";

export const educationEndpoints = {
  addEducation: (body) => api.post(`/educations`, body),

  updateEducation: (educationId, body) =>
    api.patch(`/educations/${educationId}`, body),

  updateInstituteImage: (educationId, body) =>
    api.patch(`/educations/${educationId}/institute-image`, body),

  deleteEducation: (educationId) => api.delete(`/educations/${educationId}`),

  deleteInstituteImage: (educationId) =>
    api.delete(`/educations/${educationId}/institute-image`),

  getEducation: (educationId) => api.get(`/educations/${educationId}`),

  getEducations: (params) => api.get(`/educations`, { params }),
};
