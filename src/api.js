import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''
const authToken = import.meta.env.VITE_AUTH_TOKEN || ''

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  },
})

// En producción, el token es obligatorio para llamar al backend
if (baseURL && !authToken) {
  console.warn('VITE_AUTH_TOKEN no configurado. Las peticiones al API pueden fallar con 401.')
}

export default api
