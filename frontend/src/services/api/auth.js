// src/services/api/auth.js
import api from './axios'

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials)
      
      // Check if response has data
      if (response.data && response.data.success) {
        const token = response.data.token
        const user = response.data.user
        
        if (token) {
          // Store token and user in localStorage
          localStorage.setItem('staysynce_token', token)
          if (user) {
            localStorage.setItem('staysynce_user', JSON.stringify(user))
          }
        }
        
        return {
          success: true,
          token,
          user,
          message: response.data.message || 'Login successful'
        }
      } else {
        return {
          success: false,
          message: 'Invalid response from server'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle 404 specifically
      if (error.status === 404) {
        return {
          success: false,
          message: 'Login endpoint not found. Please check backend configuration.',
          error
        }
      }
      
      return {
        success: false,
        message: error.message || 'Login failed. Please check your credentials.',
        error
      }
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData)
      
      if (response.data && response.data.success) {
        const token = response.data.token
        const user = response.data.user
        
        if (token) {
          localStorage.setItem('staysynce_token', token)
          if (user) {
            localStorage.setItem('staysynce_user', JSON.stringify(user))
          }
        }
        
        return {
          success: true,
          token,
          user,
          message: response.data.message || 'Registration successful'
        }
      } else {
        return {
          success: false,
          message: 'Invalid response from server'
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error.status === 404) {
        return {
          success: false,
          message: 'Registration endpoint not found. Please check backend configuration.',
          error
        }
      }
      
      return {
        success: false,
        message: error.message || 'Registration failed',
        error
      }
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me')
      
      if (response.data && response.data.success) {
        const user = response.data.user
        
        if (user) {
          localStorage.setItem('staysynce_user', JSON.stringify(user))
        }
        
        return {
          success: true,
          user,
          message: response.data.message || 'User retrieved successfully'
        }
      } else {
        return {
          success: false,
          message: 'Invalid response from server'
        }
      }
    } catch (error) {
      console.error('Get current user error:', error)
      
      if (error.status === 401) {
        localStorage.removeItem('staysynce_token')
        localStorage.removeItem('staysynce_user')
      }
      
      return {
        success: false,
        message: error.message || 'Failed to get user data',
        error
      }
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with client-side logout even if API call fails
    } finally {
      localStorage.removeItem('staysynce_token')
      localStorage.removeItem('staysynce_user')
      return {
        success: true,
        message: 'Logged out successfully'
      }
    }
  },

  // Utility methods
  isAuthenticated: () => {
    const token = localStorage.getItem('staysynce_token')
    return !!token
  },

  getStoredUser: () => {
    try {
      const userStr = localStorage.getItem('staysynce_user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error parsing stored user:', error)
      return null
    }
  },

  getToken: () => {
    return localStorage.getItem('staysynce_token')
  }
}