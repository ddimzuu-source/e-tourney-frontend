import axios from "axios"; // 1. Pastikan axios di-import di sini

// ─── Base URL ─────────────────────────────────────────────────────────────────
// Saat development  → http://127.0.0.1:8000/api
// Saat production   → URL backend Railway kamu (set di .env)
export const API_BASE = import.meta.env.VITE_API_URL;

// ─── Axios instance dengan auth header otomatis ───────────────────────────────
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "ngrok-skip-browser-warning": "any-value", // WAJIB ADA
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Inject token dari localStorage ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect ke login jika 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;     