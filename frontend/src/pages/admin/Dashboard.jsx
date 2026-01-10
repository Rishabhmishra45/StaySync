import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Home, DollarSign, Calendar, CreditCard, Star, Eye } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { bookingsService } from '../../services/api/bookings'
import { roomsService } from '../../services/api/rooms'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatsCard from '../../components/dashboard/StatsCard'
import Chart from '../../components/dashboard/Chart'
import { formatCurrency } from '../../utils/formatters'

const AdminDashboard = () => {
  const { data: bookings } = useQuery({
    queryKey: ['all-bookings'],
    queryFn: () => bookingsService.getAll({ limit: 100 })
  })

  const { data: rooms } = useQuery({
    queryKey: ['all-rooms'],
    queryFn: () => roomsService.getAll()
  })

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(bookings?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0),
      icon: <DollarSign className="w-6 h-6 text-white" />,
      trend: 'up',
      change: '+12.5%',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      title: 'Total Bookings',
      value: bookings?.length || 0,
      icon: <Calendar className="w-6 h-6 text-white" />,
      trend: 'up',
      change: '+8.2%',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      icon: <Home className="w-6 h-6 text-white" />,
      trend: 'up',
      change: '+5.1%',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      title: 'Available Rooms',
      value: rooms?.filter(r => r.available)?.length || 0,
      icon: <Home className="w-6 h-6 text-white" />,
      trend: 'down',
      change: '-2.3%',
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
    },
    {
      title: 'Avg. Rating',
      value: '4.7',
      icon: <Star className="w-6 h-6 text-white" />,
      trend: 'up',
      change: '+0.2',
      color: 'bg-gradient-to-br from-pink-500 to-pink-600'
    },
    {
      title: 'Active Users',
      value: '1,248',
      icon: <Users className="w-6 h-6 text-white" />,
      trend: 'up',
      change: '+15%',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    }
  ]

  const recentBookings = bookings?.slice(0, 5) || []
  const popularRooms = rooms?.sort((a, b) => b.rating - a.rating).slice(0, 3) || []

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - StaySynce</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              Hotel Overview
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Real-time insights and performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Eye className="w-5 h-5 mr-2" />
              Live View
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <TrendingUp className="w-5 h-5 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow duration-300 group">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {stat.title}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className={`w-3 h-3 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} mr-1`} />
                  <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">from last month</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Revenue Overview
              </h2>
              <Button variant="ghost" size="sm">
                Last 6 Months
              </Button>
            </div>
            <Chart type="revenue" />
          </Card>
          
          {/* Booking Trends */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Booking Trends
              </h2>
              <Button variant="ghost" size="sm">
                By Status
              </Button>
            </div>
            <Chart type="bookings" />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Bookings
              </h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">#{booking._id.slice(-6)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.user?.name} • {booking.room?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(booking.totalAmount)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Rooms */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Popular Rooms
              </h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {popularRooms.map((room) => (
                <div key={room._id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={room.images?.[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{room.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {room.rating} • ${room.pricePerNight}/night
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">${room.pricePerNight}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      room.available 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {room.available ? 'Available' : 'Booked'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">92%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Guest Satisfaction</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-500">4.2</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg. Response Time (hrs)</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-500">87%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Repeat Guests</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-500">24/7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Support Available</div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard