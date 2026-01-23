import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../../services/api/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    initializeAuth()
    // Remove or modify checkBackendStatus as it might be causing issues
    // checkBackendStatus()
  }, [])

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        signal: AbortSignal.timeout(3000) // 3 second timeout
      })
      if (response.ok) {
        setBackendStatus('online')
      } else {
        setBackendStatus('offline')
      }
    } catch (error) {
      setBackendStatus('offline')
      console.warn('Backend is offline:', error.message)
    }
  }

  const initializeAuth = () => {
    const storedUser = authService.getStoredUser()
    const token = authService.getToken()
    
    console.log('Initializing auth:', { storedUser, token })
    
    if (token && storedUser) {
      setUser(storedUser)
      // Try to validate token with backend
      validateToken(token)
    } else {
      setLoading(false)
    }
  }

  const validateToken = async (token) => {
    try {
      // Try to get current user from backend
      const result = await authService.getCurrentUser()
      if (result.success) {
        setUser(result.user)
      } else {
        // Token might be invalid, clear storage
        authService.clearStorage()
        setUser(null)
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      // Clear storage on error
      authService.clearStorage()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const result = await authService.login(credentials)
      
      if (result.success) {
        setUser(result.user)
        setBackendStatus('online')
        return result
      } else {
        if (result.backendOffline) {
          setBackendStatus('offline')
          setError('Backend server is offline. Please start the server first.')
        } else {
          setError(result.message)
        }
        throw new Error(result.message)
      }
    } catch (error) {
      setError(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const result = await authService.register(userData)
      
      if (result.success) {
        setUser(result.user)
        setBackendStatus('online')
        return result
      } else {
        if (result.backendOffline) {
          setBackendStatus('offline')
          setError('Backend server is offline. Please start the server first.')
        } else {
          setError(result.message)
        }
        throw new Error(result.message)
      }
    } catch (error) {
      setError(error.message || 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      authService.clearStorage()
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        backendStatus,
        login,
        register,
        logout,
        clearError,
        isAuthenticated: !!user && !!authService.getToken(),
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}