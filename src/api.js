import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.VITE_AUTH_TOKEN && {
      Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
    }),
  },
})

export default api
