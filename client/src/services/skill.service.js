import api from "./api.service";

export const skillEndpoints = {
  addSkill: (body) => api.post(`/skills`, body),

  updateSkill: (skillId, body) => api.patch(`/skills/${skillId}`, body),

  deleteSkill: (skillId) => api.delete(`/skills/${skillId}`),

  getSkill: (skillId) => api.get(`/skills/${skillId}`),

  getSkills: (params) => api.get(`/skills`, { params }),
};
