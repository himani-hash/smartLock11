// src/config.js
const BASE_URL = `${import.meta.env.VITE_API_URL}`;  // Use your IP here

export const API_ENDPOINTS = {
  TEST: '/api/test',
  LOGIN: '/api/login',
  UNLOCK_DOOR: '/api/web/unlock-door',
  LOCK_DOOR: '/api/web/lock-door',
  GET_STATUS: '/api/esp/status',
  GET_LOGS: '/get-all-data',
  ESP_COMMAND: '/api/esp8266/command',
  ESP_CONFIRM: '/api/esp8266/confirm'
};

export const getApiUrl = (endpoint) => {
  return `${BASE_URL}${endpoint}`;
};