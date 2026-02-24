import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

// 90 segundos: Render free tarda ~1 min en despertar
const api = axios.create({
  baseURL,
  timeout: 90000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('melo_auth_token') || import.meta.env.VITE_AUTH_TOKEN
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('melo_auth_token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
