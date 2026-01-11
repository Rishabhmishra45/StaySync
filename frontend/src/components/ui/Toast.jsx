// src/components/ui/Toast.jsx
import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now()
    const newToast = { id, message, type }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, duration)
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = useCallback((message, options = {}) => {
    return addToast(message, options.type || 'info', options.duration)
  }, [addToast])

  toast.success = (message, options = {}) => {
    return addToast(message, 'success', options.duration)
  }

  toast.error = (message, options = {}) => {
    return addToast(message, 'error', options.duration)
  }

  toast.warning = (message, options = {}) => {
    return addToast(message, 'warning', options.duration)
  }

  toast.info = (message, options = {}) => {
    return addToast(message, 'info', options.duration)
  }

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        <AnimatePresence>
          {toasts.map((toastItem) => (
            <motion.div
              key={toastItem.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`p-4 rounded-lg shadow-lg backdrop-blur-sm border ${
                toastItem.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                  : toastItem.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
                  : toastItem.type === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                  : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {toastItem.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {toastItem.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {toastItem.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                  {toastItem.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{toastItem.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toastItem.id)}
                  className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// Export the toast function directly
export const toast = {
  success: (message, options) => {
    console.log('Toast (success):', message)
    // This will be overridden by the provider
    return Date.now()
  },
  error: (message, options) => {
    console.log('Toast (error):', message)
    return Date.now()
  },
  warning: (message, options) => {
    console.log('Toast (warning):', message)
    return Date.now()
  },
  info: (message, options) => {
    console.log('Toast (info):', message)
    return Date.now()
  }
}

export default toast