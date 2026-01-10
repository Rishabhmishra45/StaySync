import React from 'react'
import { motion } from 'framer-motion'

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <motion.input
          ref={ref}
          whileFocus={{ scale: 1.01 }}
          className={`
            w-full px-4 py-2.5 rounded-lg border
            bg-input text-foreground
            placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-ring
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : 'border-border'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input