// src/config.js
const BASE_URL = `${import.meta.env.VITE_API_URL}`;  // Use your IP here

export const API_ENDPOINTS = {
  GET_STATUS: "/api/esp/status",
  UNLOCK_DOOR: "/api/web/unlock-door",
  LOCK_DOOR: "/api/web/lock-door",
  GET_LOGS: "/get-all-data",

  // NEW ENDPOINTS
  GET_ALL_USERS: "/get-users",
  UPDATE_USER: "/update-user",
  DELETE_USER: "/delete-user",
  DOWNLOAD_LOGS_PDF: "/download-logs-pdf"

  
};

export const getApiUrl = (endpoint) => {
  return `${BASE_URL}${endpoint}`;
};