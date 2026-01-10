import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../ui/Card'

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  change,
  loading = false,
  className = ''
}) => {
  const isPositive = trend === 'up'
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600'
  const bgColor = isPositive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-6 hover:shadow-lg transition-shadow duration-300 ${className}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-full ${bgColor}`}>
            {icon}
          </div>
        </div>
        
        {change && (
          <div className="mt-4 flex items-center">
            {isPositive ? (
              <TrendingUp className={`w-4 h-4 ${trendColor} mr-1`} />
            ) : (
              <TrendingDown className={`w-4 h-4 ${trendColor} mr-1`} />
            )}
            <span className={`text-sm font-medium ${trendColor}`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              from last month
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default StatsCard