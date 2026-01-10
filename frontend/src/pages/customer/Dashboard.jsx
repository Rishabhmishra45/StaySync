import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, CreditCard, Home, TrendingUp, Bell, Clock, CheckCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { bookingsService } from '../../services/api/bookings'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatsCard from '../../components/dashboard/StatsCard'
import BookingTable from '../../components/dashboard/BookingTable'
import { formatCurrency, formatDate } from '../../utils/formatters'

const CustomerDashboard = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingsService.getMyBookings,
    refetchOnWindowFocus: true
  })

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings?.length || 0,
      icon: <Calendar className="w-6 h-6 text-white" />,
      trend: 'up',
      change: '+12%',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: 'Active Stays',
      value: bookings?.filter(b => b.status === 'confirmed' || b.status === 'checked_in')?.length || 0,
      icon: <Home className="w-6 h-6 text-white" />,
      trend: 'up',
      change: '+8%',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      title: 'Pending',
      value: bookings?.filter(b => b.status === 'pending')?.length || 0,
      icon: <Clock className="w-6 h-6 text-white" />,
      trend: 'down',
      change: '-5%',
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
    },
    {
      title: 'Total Spent',
      value: formatCurrency(bookings?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0),
      icon: <CreditCard className="w-6 h-6 text-white" />,
      trend: 'up',
      change: '+15%',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
  ]

  const upcomingBookings = bookings?.filter(b => 
    ['confirmed', 'pending'].includes(b.status) && 
    new Date(b.checkIn) > new Date()
  ).slice(0, 3) || []

  return (
    <>
      <Helmet>
        <title>Dashboard - StaySynce</title>
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
              Welcome Back!
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here's what's happening with your bookings
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} rounded-full opacity-10 -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-300`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                      {stat.icon}
                    </div>
                    <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {stat.title}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upcoming Bookings
                </h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <motion.div
                      key={booking._id}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {booking.room?.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No upcoming bookings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Book your next stay to see it here
                  </p>
                  <Button as="a" href="/rooms">
                    Browse Rooms
                  </Button>
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  { action: 'Booking confirmed', room: 'Deluxe Suite', time: '2 hours ago' },
                  { action: 'Payment processed', room: 'Ocean View Room', time: '1 day ago' },
                  { action: 'Booking requested', room: 'Executive Suite', time: '2 days ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.room}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-5 h-5 mr-3" />
                  Book New Stay
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="w-5 h-5 mr-3" />
                  Payment Methods
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="w-5 h-5 mr-3" />
                  Notification Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Home className="w-5 h-5 mr-3" />
                  Saved Properties
                </Button>
              </div>

              {/* Promo Banner */}
              <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-primary to-secondary">
                <h3 className="font-semibold text-white mb-2">
                  Exclusive Member Offer
                </h3>
                <p className="text-sm text-white/80 mb-3">
                  Get 20% off your next booking
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Apply Code: STAY20
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* All Bookings Table */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            All Bookings
          </h2>
          <BookingTable isAdmin={false} />
        </Card>
      </div>
    </>
  )
}

export default CustomerDashboard