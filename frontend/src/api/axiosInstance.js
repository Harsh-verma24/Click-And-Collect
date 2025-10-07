import axios from 'axios'

// Use Vite env var if provided, otherwise fallback to the deployed backend
const BASE_URL = import.meta.env.VITE_API_URL || 'https://click-and-collect-backend.onrender.com/'

const api = axios.create({
  baseURL: BASE_URL,
  // do not force Content-Type globally — let the browser/axios set it per-request
})

// Attach token automatically from localStorage
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
      console.debug('API: attaching token to request', token && token.slice ? token.slice(0,10)+'...' : token)
    }
  } catch (e) {
    // ignore
  }
  return config
}, (error) => Promise.reject(error))

export default api
