// src/services/api/axios.js
import axios from 'axios'

// IMPORTANT: Remove any environment variables and use direct URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure it's /api
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('staysync_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status
    })

    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return Promise.reject({
        message: 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000',
        status: 0,
        code: 'NETWORK_ERROR'
      })
    }

    // If 404, check if it's because of missing /api prefix
    if (error.response?.status === 404) {
      console.error('404 Error - Check if route exists:', error.config?.url)
    }

    return Promise.reject({
      message: error.response?.data?.message || error.response?.data?.error || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    })
  }
)

export default api