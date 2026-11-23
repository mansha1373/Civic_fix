import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api"

/**
 * Centralized Axios API Client
 * - withCredentials: true ensures HTTP-only cookies are included in requests
 * - Interceptors handle Bearer token fallback and uniform error message extraction
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})

// Request interceptor: Attach JWT token from localStorage as fallback for non-cookie environments
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("civicfix_token")
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: Extract clean user-facing error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unable to communicate with CivicFix server. Please check your network."
    return Promise.reject(new Error(message))
  }
)

export default api
