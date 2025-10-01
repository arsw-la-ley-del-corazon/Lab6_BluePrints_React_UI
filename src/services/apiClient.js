import axios from 'axios'
import mock from './mockApiClient.js'

const useMock = String(import.meta.env.VITE_USE_MOCK || '').toLowerCase() === 'true'

let client

if (useMock) {
  
  console.log('⚠️ Usando MOCK de blueprints')
  client = mock
} else {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: 8000,
  })

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
      }
      return Promise.reject(err)
    },
  )

  client = api
}

export default client
