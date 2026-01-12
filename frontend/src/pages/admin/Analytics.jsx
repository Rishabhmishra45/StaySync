// src/pages/admin/Analytics.jsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Home,
  Star,
  Eye,
  Download,
  Filter,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react'
import { bookingsService } from '../../services/api/bookings'
import { roomsService } from '../../services/api/rooms'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Chart from '../../components/dashboard/Chart'
import { formatCurrency } from '../../utils/formatters'

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('monthly')

  const { data: bookingsResponse } = useQuery({
    queryKey: ['analytics-bookings'],
    queryFn: () => bookingsService.getAll({ limit: 500 })
  })

  const { data: roomsResponse } = useQuery({
    queryKey: ['analytics-rooms'],
    queryFn: () => roomsService.getAll()
  })

  const bookings = bookingsResponse?.data || []
  const rooms = roomsResponse?.data || []

  // Calculate analytics metrics
  const analyticsMetrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)),
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      change: '+8.2%',
      trend: 'up',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      title: 'Occupancy Rate',
      value: `${Math.round(((rooms.filter(r => !r.available).length) / rooms.length) * 100)}%`,
      change: '+5.1%',
      trend: 'up',
      icon: <Home className="w-6 h-6" />
    },
    {
      title: 'Avg. Daily Rate',
      value: formatCurrency(bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) / (bookings.length || 1)),
      change: '+3.2%',
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />
    }
  ]

  // Calculate booking source distribution
  const bookingSources = [
    { name: 'Direct Website', value: 45, color: 'bg-primary' },
    { name: 'Booking.com', value: 25, color: 'bg-blue-500' },
    { name: 'Expedia', value: 15, color: 'bg-green-500' },
    { name: 'Travel Agents', value: 10, color: 'bg-purple-500' },
    { name: 'Phone', value: 5, color: 'bg-yellow-500' }
  ]

  // Guest demographics
  const guestDemographics = [
    { country: 'United States', percentage: 35, visitors: 1280 },
    { country: 'United Kingdom', percentage: 20, visitors: 732 },
    { country: 'Germany', percentage: 15, visitors: 549 },
    { country: 'Canada', percentage: 10, visitors: 366 },
    { country: 'Australia', percentage: 8, visitors: 293 },
    { country: 'Others', percentage: 12, visitors: 439 }
  ]

  return (
    <>
      <Helmet>
        <title>Analytics - StaySync Admin</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Data-driven insights and performance metrics
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-3"
          >
            <Select
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' }
              ]}
              value={timeRange}
              onChange={setTimeRange}
              className="w-40"
            />
            <Button variant="outline">
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <Eye className="w-5 h-5 mr-2" />
              Live View
            </Button>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                    {metric.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      {metric.title}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className={`w-3 h-3 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'} mr-1`} />
                  <span className={`text-xs font-medium ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">from last period</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Revenue Analytics
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Monthly revenue trends</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Chart type="revenue" />
            </Card>
          </motion.div>

          {/* Booking Sources */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <PieChart className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Booking Sources
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Where bookings come from</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {bookingSources.map((source, index) => (
                  <div key={source.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-800 dark:text-gray-200">{source.name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{source.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${source.color} rounded-full`}
                        style={{ width: `${source.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Guest Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6 hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Guest Demographics
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Visitor distribution by country</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Country</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Visitors</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Percentage</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {guestDemographics.map((demo, index) => (
                    <tr key={demo.country} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{demo.country}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">{demo.visitors.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                            style={{ width: `${demo.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">{demo.percentage}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${index < 2 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                          {index < 2 ? 'Growing' : 'Stable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Performance Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">92%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Guest Satisfaction</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">4.2</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg. Response Time (hrs)</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">87%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Repeat Guests</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Support Available</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  )
}

export default AdminAnalytics