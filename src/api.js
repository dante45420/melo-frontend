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
  console.log('[Melo API]', config.method?.toUpperCase(), config.baseURL + config.url)
  return config
})

api.interceptors.response.use(
  (r) => {
    console.log('[Melo API]', r.status, r.config.url)
    return r
  },
  (err) => {
    console.error('[Melo API] Error:', err.code, err.message, err.response?.status, err.response?.data)
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
