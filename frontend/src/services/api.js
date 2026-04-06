import axios from 'axios'
import { auth } from './firebase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 15000,
})

// Attach Firebase token to every request
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser
    if (user) {
      const token = await user.getIdToken()
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    // Token fetch failed — proceed without auth (public endpoints still work)
    console.warn('Token fetch skipped:', e.message)
  }
  return config
})

// Response interceptor with graceful error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status

    // Don't throw toast-worthy errors for 401 on public routes
    if (status === 401) {
      const msg = 'Authentication required'
      return Promise.reject(new Error(msg))
    }

    // Token expired — user needs to re-login
    if (status === 403) {
      const msg = err.response?.data?.detail || 'Access denied'
      return Promise.reject(new Error(msg))
    }

    const msg = err.response?.data?.detail || err.message || 'Request failed'
    return Promise.reject(new Error(msg))
  }
)

export default api
