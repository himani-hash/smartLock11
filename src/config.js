// src/config.js

// ⭐ Use your PythonAnywhere backend URL here:
const BASE_URL = "https://himani.pythonanywhere.com";

export const API_ENDPOINTS = {
  GET_STATUS: "/api/esp/status",
  UNLOCK_DOOR: "/api/web/unlock-door",
  LOCK_DOOR: "/api/web/lock-door",
  GET_LOGS: "/get-all-data",

  // USER MANAGEMENT
  GET_ALL_USERS: "/get-users",
  UPDATE_USER: "/update-user",
  DELETE_USER: "/delete-user",

  // DOWNLOAD PDF
  DOWNLOAD_LOGS_PDF: "/download-logs-pdf"
};

// Convert endpoint → full URL
export const getApiUrl = (endpoint) => {
  return `${BASE_URL}${endpoint}`;
};
