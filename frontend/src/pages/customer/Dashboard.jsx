import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Calendar, CreditCard, Home, TrendingUp, Bell, Clock, 
  CheckCircle, Package, TrendingDown, ArrowUpRight, 
  ArrowDownRight, Eye, Plus, Settings, Heart, Star,
  ChevronRight, Filter, Download, Sparkles
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { bookingsService } from '../../services/api/bookings'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import BookingTable from '../../components/dashboard/BookingTable'
import { formatCurrency, formatDate } from '../../utils/formatters'

const CustomerDashboard = () => {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingsService.getMyBookings,
    refetchOnWindowFocus: false,
    staleTime: 30000 // 30 seconds
  })

  // Extract bookings from response
  const bookings = Array.isArray(response?.data) ? response.data : []
  
  // Calculate statistics
  const totalBookings = bookings.length
  const activeStays = bookings.filter(b => 
    ['confirmed', 'checked_in'].includes(b?.status)
  ).length
  const pendingBookings = bookings.filter(b => 
    b?.status === 'pending'
  ).length
  const totalSpent = bookings.reduce((sum, b) => 
    sum + (b.totalAmount || 0), 0
  )

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: <Package className="w-5 h-5" />,
      trend: 'up',
      change: '+12%',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500/10 to-blue-600/10',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Active Stays',
      value: activeStays,
      icon: <Home className="w-5 h-5" />,
      trend: 'up',
      change: '+8%',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Pending',
      value: pendingBookings,
      icon: <Clock className="w-5 h-5" />,
      trend: pendingBookings > 0 ? 'down' : 'neutral',
      change: pendingBookings > 0 ? '-5%' : '0%',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-500/10 to-amber-600/10',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      title: 'Total Spent',
      value: formatCurrency(totalSpent),
      icon: <CreditCard className="w-5 h-5" />,
      trend: 'up',
      change: '+15%',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-gradient-to-br from-violet-500/10 to-violet-600/10',
      textColor: 'text-violet-600 dark:text-violet-400'
    }
  ]

  const upcomingBookings = bookings
    .filter(b => ['confirmed', 'pending'].includes(b?.status) && 
      new Date(b.checkIn) > new Date()
    )
    .slice(0, 3)

  const recentActivity = bookings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <Card className="p-8 max-w-md w-full border border-red-200 dark:border-red-800">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <Bell className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error.message || 'Unable to load your bookings data'}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - StaySynce</title>
      </Helmet>

      <div className="space-y-6 max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">
                Welcome Back!
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            >
              Your Dashboard
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Track and manage all your bookings in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              size="sm"
              className="hidden sm:flex border-gray-300 dark:border-gray-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-4 sm:px-6"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">New Booking</span>
              <span className="sm:hidden">Book</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-5 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="relative">
                  {/* Background gradient */}
                  <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-5`} />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <div className={stat.textColor}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend === 'up' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : stat.trend === 'down'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : stat.trend === 'down' ? (
                        <ArrowDownRight className="w-3 h-3" />
                      ) : null}
                      {stat.change}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Bookings */}
            <Card className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    Upcoming Bookings
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your next stays
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary hover:text-primary/80"
                  as="a" 
                  href="/dashboard/bookings"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <motion.div
                      key={booking._id}
                      whileHover={{ scale: 1.01 }}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <div className="flex items-start sm:items-center gap-4 mb-3 sm:mb-0">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20">
                          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {booking.room?.name || 'Deluxe Room'}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(booking.checkIn)}
                            </span>
                            <span className="hidden sm:inline text-gray-400">→</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(booking.checkOut)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <p className="font-bold text-lg text-primary">
                          {formatCurrency(booking.totalAmount || 0)}
                        </p>
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : booking.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Pending'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <Calendar className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No upcoming bookings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Start planning your next getaway and book a stay
                  </p>
                  <Button 
                    as="a" 
                    href="/rooms"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    Browse Available Rooms
                  </Button>
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card className="p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((booking, index) => (
                  <motion.div
                    key={booking._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Booking {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.room?.name || 'Room'} • {formatDate(booking.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-primary">
                        {formatCurrency(booking.totalAmount || 0)}
                      </span>
                      <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <Card className="p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {[
                  { icon: <Plus className="w-5 h-5" />, label: 'New Booking', href: '/rooms' },
                  { icon: <Eye className="w-5 h-5" />, label: 'View All Bookings', href: '/dashboard/bookings' },
                  { icon: <CreditCard className="w-5 h-5" />, label: 'Payment Methods', href: '/dashboard/payments' },
                  { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/dashboard/settings' },
                  { icon: <Heart className="w-5 h-5" />, label: 'Saved Properties', href: '/dashboard/saved' },
                  { icon: <Star className="w-5 h-5" />, label: 'Leave Review', href: '/reviews' }
                ].map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary py-3"
                      as="a"
                      href={action.href}
                    >
                      <span className="mr-3">{action.icon}</span>
                      {action.label}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Promo Banner */}
              <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    <h3 className="font-semibold text-white">
                      Exclusive Offer
                    </h3>
                  </div>
                  <p className="text-sm text-white/90 mb-4">
                    Get 20% off your next booking with code: <span className="font-bold">STAY20</span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                    as="a"
                    href="/rooms"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>

            {/* Booking Summary */}
            <Card className="p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Booking Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Bookings</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{totalBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Completed Stays</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {bookings.filter(b => b.status === 'checked_out').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Cancelled</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {bookings.filter(b => b.status === 'cancelled').length}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(totalSpent)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* All Bookings Table */}
        {bookings.length > 0 && (
          <Card className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  All Bookings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Complete history of your stays
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
              <div className="min-w-full">
                <BookingTable isAdmin={false} />
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  )
}

export default CustomerDashboard