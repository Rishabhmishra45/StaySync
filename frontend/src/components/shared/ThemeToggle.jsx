import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../app/providers/ThemeProvider'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        <motion.div
          initial={false}
          animate={{ 
            rotate: theme === 'dark' ? 180 : 0,
            scale: theme === 'dark' ? 0 : 1 
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Sun className="w-5 h-5 text-yellow-500" />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{ 
            rotate: theme === 'dark' ? 0 : -180,
            scale: theme === 'dark' ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Moon className="w-5 h-5 text-blue-400" />
        </motion.div>
      </div>
    </motion.button>
  )
}

export default ThemeToggle