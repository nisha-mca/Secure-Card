import axios from "axios";

// Locally this stays "/api" and is proxied to localhost:5000 by vite.config.js.
// In production, set VITE_API_URL to your deployed backend's URL, e.g.
// VITE_API_URL=https://secure-card-api.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
