import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Select = React.forwardRef(({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="space-y-2" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg border
            bg-background text-foreground
            focus:outline-none focus:ring-2 focus:ring-primary
            transition-all duration-200
            flex items-center justify-between
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${className}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          {...props}
        >
          <span className={selectedOption ? '' : 'text-muted-foreground'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`
                      w-full px-4 py-2 text-left
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      transition-colors duration-150
                      flex items-center justify-between
                      ${value === option.value ? 'bg-primary/10 text-primary' : ''}
                    `}
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                  >
                    <span>{option.label}</span>
                    {value === option.value && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select