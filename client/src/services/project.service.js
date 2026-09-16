import api from "./api.service";

export const projectEndpoints = {
  addProject: (body) => api.post(`/projects`, body),

  updateProject: (projectId, body) => api.patch(`/projects/${projectId}`, body),

  updateProjectImage: (projectId, body) =>
    api.patch(`/projects/${projectId}/project-images`, body),

  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),

  deleteProjectImage: (projectId, imagePublicId) =>
    api.delete(`/projects/${projectId}/project-images/${imagePublicId}`),

  getProject: (projectId) => api.get(`/projects/${projectId}`),

  getProjects: (params) => api.get(`/projects`, { params }),
};
