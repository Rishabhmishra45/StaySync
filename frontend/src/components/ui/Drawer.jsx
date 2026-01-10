import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './Button'

const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md'
}) => {
  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    top: 'top-0',
    bottom: 'bottom-0'
  }

  const sizeClasses = {
    sm: position === 'left' || position === 'right' ? 'w-80' : 'h-80',
    md: position === 'left' || position === 'right' ? 'w-96' : 'h-96',
    lg: position === 'left' || position === 'right' ? 'w-[28rem]' : 'h-[28rem]',
    xl: position === 'left' || position === 'right' ? 'w-[32rem]' : 'h-[32rem]'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{
              x: position === 'left' ? -400 : position === 'right' ? 400 : 0,
              y: position === 'top' ? -400 : position === 'bottom' ? 400 : 0
            }}
            animate={{ x: 0, y: 0 }}
            exit={{
              x: position === 'left' ? -400 : position === 'right' ? 400 : 0,
              y: position === 'top' ? -400 : position === 'bottom' ? 400 : 0
            }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed ${positionClasses[position]} top-0 h-full ${sizeClasses[size]} bg-white dark:bg-gray-800 shadow-2xl z-50`}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-foreground">
                {title}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto h-[calc(100%-5rem)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Drawer