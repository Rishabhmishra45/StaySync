// src/app/providers/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../../services/api/auth'
import { storage } from '../../services/storage'

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

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = storage.getToken()
      if (token) {
        const userData = await authService.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      storage.clearToken()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await authService.login({ email, password })
    storage.setToken(response.token)
    setUser(response.user)
    return response
  }

  const register = async (userData) => {
    const response = await authService.register(userData)
    storage.setToken(response.token)
    setUser(response.user)
    return response
  }

  const logout = () => {
    storage.clearToken()
    setUser(null)
    window.location.href = '/login'
  }

  const updateProfile = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}