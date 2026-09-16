import api from "./api.service";

export const authEndpoints = {
  googleAuth: (body, config) => api.post(`/auth/google`, body, config),

  register: (body) => api.post(`/auth/register`, body),

  login: (body, config) => api.post(`/auth/login`, body, config),

  logout: () => api.post(`/auth/logout`),

  removeSession: (body) => api.post(`/auth/remove-session`, body),

  restoreSession: (config) => api.post(`/auth/restoreSession`, {}, config),

  changePassword: (body) => api.patch(`/auth/password`, body),

  forgotPassword: (body) => api.post(`/auth/forgot-password`, body),

  verifyOTP: (body) => api.post(`/auth/verify-otp`, body),

  resetPassword: (body) => api.patch(`/auth/reset-password`, body),

  checkPassword: () => api.get(`/users/check-password`),
};
