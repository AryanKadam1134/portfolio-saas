import api from "./api.service";

export const certificateEndpoints = {
  addCertificate: (body) => api.post(`/certificates`, body),

  updateCertificate: (certificateId, body) =>
    api.patch(`/certificates/${certificateId}`, body),

  updateCertificateImage: (certificateId, body) =>
    api.patch(`/certificates/${certificateId}/certificate-image`, body),

  deleteCertificate: (certificateId) =>
    api.delete(`/certificates/${certificateId}`),

  deleteCertificateImage: (certificateId) =>
    api.delete(`/certificates/${certificateId}/certificate-image`),

  getCertificate: (certificateId) => api.get(`/certificates/${certificateId}`),

  getCertificates: (params) => api.get(`/certificates`, { params }),
};
