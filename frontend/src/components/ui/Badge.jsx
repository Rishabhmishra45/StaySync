import React from 'react'

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full'

    const variants = {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
    }

    return (
        <span
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </span>
    )
}

export default Badge