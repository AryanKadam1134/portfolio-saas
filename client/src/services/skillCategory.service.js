import api from "./api.service";

export const skillCategoryEndpoints = {
  addSkillCategory: (body) => api.post(`/skillCategories`, body),

  updateSkillCategory: (categoryId, body) =>
    api.patch(`/skillCategories/${categoryId}`, body),

  deleteSkillCategory: (categoryId) =>
    api.delete(`/skillCategories/${categoryId}`),

  getSkillCategory: (categoryId) => api.get(`/skillCategories/${categoryId}`),

  getSkillCategories: (params) => api.get(`/skillCategories`, { params }),
};
