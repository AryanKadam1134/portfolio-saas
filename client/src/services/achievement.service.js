import api from "./api.service";

export const achievementEndpoints = {
  addAchievement: (body) => api.post(`/achievements`, body),

  updateAchievement: (achievementId, body) =>
    api.patch(`/achievements/${achievementId}`, body),

  updateAchievementImage: (achievementId, body) =>
    api.patch(`/achievements/${achievementId}/achievement-images`, body),

  deleteAchievement: (achievementId) =>
    api.delete(`/achievements/${achievementId}`),

  deleteAchievementImage: (achievementId, imagePublicId) =>
    api.delete(
      `/achievements/${achievementId}/achievement-images/${imagePublicId}`,
    ),

  getAchievement: (achievementId) => api.get(`/achievements/${achievementId}`),

  getAchievements: (params) => api.get(`/achievements`, { params }),
};
