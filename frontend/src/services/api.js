import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const checkHealth = async () => {
  return axios.get(`${API_BASE}/`);
};

export const getStyles = async () => {
  return axios.get(`${API_BASE}/styles`);
};

export const analyzeFrame = async (imageBlob) => {
  const formData = new FormData();
  formData.append('file', imageBlob, 'frame.jpg');
  return axios.post(`${API_BASE}/analyze-frame`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const startRecording = async () => {
  return axios.post(`${API_BASE}/start-recording`);
};

export const stopRecording = async () => {
  return axios.post(`${API_BASE}/stop-recording`);
};

export const compareDance = async () => {
  return axios.post(`${API_BASE}/compare`);
};

export const setStep = async (stepId) => {
  return axios.post(`${API_BASE}/set-step/${stepId}`);
};

export const resetSession = async () => {
  return axios.post(`${API_BASE}/reset`);
};
