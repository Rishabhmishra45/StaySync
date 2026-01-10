import React from 'react'

const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-4 py-2.5 rounded-lg border
          bg-background text-foreground
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary
          transition-all duration-200
          resize-none
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea