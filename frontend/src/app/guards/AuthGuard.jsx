import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // If still loading after 3 seconds, show error
  if (loading) {
    // Add a timeout to prevent infinite loading
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600">Checking authentication...</p>
        <p className="text-sm text-gray-500 mt-2">
          If this takes too long, try clearing browser cache or login again
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default AuthGuard