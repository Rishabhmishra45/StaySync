import React from 'react'

const Skeleton = ({
  className = '',
  variant = 'text',
  animation = 'pulse',
  ...props
}) => {
  const baseStyles = 'bg-gray-300 dark:bg-gray-700 rounded'

  const variants = {
    text: 'h-4',
    circle: 'rounded-full',
    rectangular: '',
    card: 'h-48',
    avatar: 'h-12 w-12 rounded-full'
  }

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: ''
  }

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${animations[animation]} ${className}`}
      {...props}
    />
  )
}

export const SkeletonText = ({ lines = 3, ...props }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" {...props} />
    ))}
  </div>
)

export const SkeletonCard = () => (
  <div className="space-y-4 p-4 border rounded-lg">
    <Skeleton variant="card" className="w-full" />
    <SkeletonText lines={3} />
  </div>
)

export default Skeleton