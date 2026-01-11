// src/services/api/axios.js
import axios from 'axios'
import { storage } from '../storage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return the data directly for easier access
    return {
      ...response,
      data: response.data.data || response.data,
      meta: response.data.meta,
      pagination: response.data.pagination
    }
  },
  (error) => {
    // Handle errors
    if (error.response) {
      const { status, data } = error.response
      
      // Auto logout on 401 Unauthorized
      if (status === 401) {
        storage.clearToken()
        storage.clearUser()
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
        }
      }
      
      // Extract error message
      const errorMessage = data?.message || data?.error || `Request failed with status ${status}`
      console.error(`API Error ${status}:`, errorMessage)
      
      // Return a consistent error structure
      return Promise.reject({
        message: errorMessage,
        status,
        data: data || {}
      })
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error:', error.request)
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0
      })
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message)
      return Promise.reject({
        message: error.message || 'Request failed',
        status: 0
      })
    }
  }
)

export default api