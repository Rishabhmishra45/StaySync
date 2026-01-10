import React from 'react'
import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hoverable = false,
  padding = true,
  glass = false,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl border border-border
        bg-card
        ${glass ? 'glass' : ''}
        ${hoverable ? 'hover:shadow-lg transition-all duration-300' : 'shadow-sm'}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      whileHover={hoverable ? { y: -4 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card