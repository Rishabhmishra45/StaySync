import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { bookingsService } from '../../services/api/bookings'

const Chart = ({ type = 'revenue', className = '' }) => {
  const { data: bookings } = useQuery({
    queryKey: ['bookings-chart'],
    queryFn: () => bookingsService.getAll({ limit: 100 })
  })

  const chartData = useMemo(() => {
    if (!bookings) return []
    
    if (type === 'revenue') {
      // Group by month and calculate revenue
      const monthlyRevenue = {}
      bookings.forEach(booking => {
        const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short' })
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (booking.totalAmount || 0)
      })
      
      return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month,
        revenue
      })).slice(-6) // Last 6 months
    }
    
    if (type === 'bookings') {
      // Group by status
      const statusCount = {
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        checked_in: 0,
        checked_out: 0
      }
      
      bookings.forEach(booking => {
        if (statusCount[booking.status] !== undefined) {
          statusCount[booking.status]++
        }
      })
      
      return Object.entries(statusCount).map(([status, count]) => ({
        status,
        count
      }))
    }
    
    return []
  }, [bookings, type])

  const maxValue = useMemo(() => {
    if (type === 'revenue') {
      return Math.max(...chartData.map(d => d.revenue), 1)
    }
    return Math.max(...chartData.map(d => d.count), 1)
  }, [chartData, type])

  return (
    <div className={`${className}`}>
      <div className="h-64">
        {type === 'revenue' ? (
          <div className="flex items-end justify-between h-48 space-x-2">
            {chartData.map((item, index) => {
              const height = (item.revenue / maxValue) * 100
              return (
                <motion.div
                  key={item.month}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex-1 group"
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-300 group-hover:opacity-80" />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    ${item.revenue.toFixed(2)}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                    {item.month}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {chartData.map((item, index) => {
              const width = (item.count / maxValue) * 100
              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-gray-700 dark:text-gray-300">
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Chart