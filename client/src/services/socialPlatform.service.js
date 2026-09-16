import api from "./api.service";

export const socialPlatformEndpoints = {
  addSocialPlatform: (body) => api.post(`/socialPlatforms`, body),

  updateSocialPlatform: (platformId, body) =>
    api.patch(`/socialPlatforms/${platformId}`, body),

  deleteSocialPlatform: (platformId) =>
    api.delete(`/socialPlatforms/${platformId}`),

  getSocialPlatform: (platformId) => api.get(`/socialPlatforms/${platformId}`),

  getSocialPlatforms: (params) => api.get(`/socialPlatforms`, { params }),
};
