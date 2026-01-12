import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { bookingsService } from '../../services/api/bookings'

const Chart = ({ type = 'revenue', className = '' }) => {
  const { data: bookingsResponse, isLoading } = useQuery({
    queryKey: ['bookings-chart'],
    queryFn: () => bookingsService.getAll({ limit: 100 })
  })

  // Extract bookings array from the response with proper error handling
  const bookings = useMemo(() => {
    if (!bookingsResponse || !bookingsResponse.success) return []
    
    // Handle different response structures
    if (Array.isArray(bookingsResponse.data)) {
      return bookingsResponse.data
    } else if (bookingsResponse.data && bookingsResponse.data.data) {
      return bookingsResponse.data.data
    } else if (bookingsResponse.data) {
      return Array.isArray(bookingsResponse.data) ? bookingsResponse.data : []
    }
    return []
  }, [bookingsResponse])

  const chartData = useMemo(() => {
    if (!Array.isArray(bookings) || bookings.length === 0) {
      return type === 'revenue' 
        ? [{ month: 'Jan', revenue: 0 }, { month: 'Feb', revenue: 0 }, { month: 'Mar', revenue: 0 }, { month: 'Apr', revenue: 0 }, { month: 'May', revenue: 0 }, { month: 'Jun', revenue: 0 }]
        : [{ status: 'confirmed', count: 0 }, { status: 'pending', count: 0 }, { status: 'cancelled', count: 0 }, { status: 'checked_in', count: 0 }, { status: 'checked_out', count: 0 }]
    }
    
    if (type === 'revenue') {
      // Group by month and calculate revenue
      const monthlyRevenue = {}
      const last6Months = []
      
      // Get last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const month = date.toLocaleString('default', { month: 'short' })
        monthlyRevenue[month] = 0
        last6Months.push(month)
      }
      
      bookings.forEach(booking => {
        if (booking.createdAt) {
          const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short' })
          if (monthlyRevenue[month] !== undefined) {
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (booking.totalAmount || 0)
          }
        }
      })
      
      return last6Months.map(month => ({
        month,
        revenue: monthlyRevenue[month] || 0
      }))
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
        if (booking.status && statusCount[booking.status] !== undefined) {
          statusCount[booking.status]++
        } else if (booking.status) {
          statusCount.confirmed++ // Default fallback
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
    if (chartData.length === 0) return 1
    
    if (type === 'revenue') {
      const values = chartData.map(d => d.revenue || 0)
      return Math.max(...values, 1)
    }
    
    const values = chartData.map(d => d.count || 0)
    return Math.max(...values, 1)
  }, [chartData, type])

  if (isLoading) {
    return (
      <div className={`${className} h-64 flex items-center justify-center`}>
        <div className="text-gray-500 dark:text-gray-400">Loading chart data...</div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="h-64">
        {type === 'revenue' ? (
          <div className="flex items-end justify-between h-48 space-x-2">
            {chartData.map((item, index) => {
              const height = ((item.revenue || 0) / maxValue) * 100
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
                    ${(item.revenue || 0).toFixed(2)}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400">
                    {item.month}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {chartData.map((item, index) => {
              const width = ((item.count || 0) / maxValue) * 100
              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-gray-800 dark:text-gray-200">
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.count || 0}</span>
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