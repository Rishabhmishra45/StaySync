import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Filter, Calendar, Download, Printer, Share2, Search, 
  DollarSign, Clock, TrendingUp, AlertCircle, CheckCircle,
  XCircle, Hotel, Users, ChevronRight, Eye, FileText,
  RefreshCw, HelpCircle, Shield, CreditCard, Phone
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { bookingsService } from '../../services/api/bookings'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import BookingTable from '../../components/dashboard/BookingTable'
import { formatCurrency, formatDate, calculateNights } from '../../utils/formatters'

const MyBookings = () => {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sort: 'newest'
  })
  const [filteredBookings, setFilteredBookings] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    totalSpent: 0,
    averageStay: 0,
    upcoming: 0,
    completed: 0
  })
  const [notification, setNotification] = useState(null)

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingsService.getMyBookings,
    refetchOnWindowFocus: true
  })

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Extract bookings from response
  const bookings = Array.isArray(response?.data) ? response.data : []

  // Apply filters and update stats
  useEffect(() => {
    if (!bookings.length) {
      setFilteredBookings([])
      setStats({
        total: 0,
        totalSpent: 0,
        averageStay: 0,
        upcoming: 0,
        completed: 0
      })
      return
    }

    let result = [...bookings]

    // Apply status filter
    if (filters.status) {
      result = result.filter(booking => booking.status === filters.status)
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(booking => {
        const bookingId = booking._id?.toLowerCase() || ''
        const roomName = booking.room?.name?.toLowerCase() || ''
        const roomType = booking.room?.type?.toLowerCase() || ''
        
        return (
          bookingId.includes(searchLower) ||
          roomName.includes(searchLower) ||
          roomType.includes(searchLower)
        )
      })
    }

    // Apply sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'oldest':
          return new Date(a.createdAt || a.checkIn) - new Date(b.createdAt || b.checkIn)
        case 'price_high':
          return (b.totalAmount || 0) - (a.totalAmount || 0)
        case 'price_low':
          return (a.totalAmount || 0) - (b.totalAmount || 0)
        case 'newest':
        default:
          return new Date(b.createdAt || b.checkIn) - new Date(a.createdAt || a.checkIn)
      }
    })

    setFilteredBookings(result)

    // Calculate statistics
    const totalSpent = result.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
    const totalNights = result.reduce((sum, b) => {
      if (b.checkIn && b.checkOut) {
        return sum + calculateNights(b.checkIn, b.checkOut)
      }
      return sum
    }, 0)
    
    const upcoming = result.filter(b => 
      ['confirmed', 'pending'].includes(b.status) && 
      new Date(b.checkIn) > new Date()
    ).length
    
    const completed = result.filter(b => 
      b.status === 'checked_out'
    ).length

    setStats({
      total: result.length,
      totalSpent,
      averageStay: result.length > 0 ? totalNights / result.length : 0,
      upcoming,
      completed
    })
  }, [bookings, filters])

  const handleExport = () => {
    showNotification('Export feature coming soon!', 'info')
  }

  const handlePrint = () => {
    window.print()
    showNotification('Preparing print...', 'info')
  }

  const handleRefresh = () => {
    refetch()
    showNotification('Refreshing bookings...', 'info')
  }

  const getStatusCount = (status) => {
    return bookings.filter(b => b.status === status).length
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <Card className="p-8 max-w-md w-full border border-red-200 dark:border-red-800">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
              Failed to Load Bookings
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error.message || 'Unable to connect to the server'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Please check your connection and try again
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => refetch()}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="outline"
                as="a"
                href="/support"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Get Help
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>My Bookings - StaySynce</title>
      </Helmet>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/90 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : notification.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/90 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-900/90 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </motion.div>
      )}

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
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">
                Your Reservations
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            >
              My Bookings
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Manage and track all your reservations in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-gray-300 dark:border-gray-600"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="hidden sm:flex border-gray-300 dark:border-gray-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="hidden sm:flex border-gray-300 dark:border-gray-600"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: 'Total Bookings',
              value: stats.total,
              icon: <Calendar className="w-5 h-5" />,
              color: 'from-blue-500 to-blue-600',
              bgColor: 'bg-gradient-to-br from-blue-500/10 to-blue-600/10',
              textColor: 'text-blue-600 dark:text-blue-400'
            },
            {
              title: 'Upcoming',
              value: stats.upcoming,
              icon: <Clock className="w-5 h-5" />,
              color: 'from-emerald-500 to-emerald-600',
              bgColor: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10',
              textColor: 'text-emerald-600 dark:text-emerald-400'
            },
            {
              title: 'Completed',
              value: stats.completed,
              icon: <CheckCircle className="w-5 h-5" />,
              color: 'from-violet-500 to-violet-600',
              bgColor: 'bg-gradient-to-br from-violet-500/10 to-violet-600/10',
              textColor: 'text-violet-600 dark:text-violet-400'
            },
            {
              title: 'Total Spent',
              value: formatCurrency(stats.totalSpent),
              icon: <DollarSign className="w-5 h-5" />,
              color: 'from-amber-500 to-amber-600',
              bgColor: 'bg-gradient-to-br from-amber-500/10 to-amber-600/10',
              textColor: 'text-amber-600 dark:text-amber-400'
            },
            {
              title: 'Avg. Stay',
              value: `${stats.averageStay.toFixed(1)} nights`,
              icon: <Hotel className="w-5 h-5" />,
              color: 'from-rose-500 to-rose-600',
              bgColor: 'bg-gradient-to-br from-rose-500/10 to-rose-600/10',
              textColor: 'text-rose-600 dark:text-rose-400'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                    <div className={stat.textColor}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters and Booking Table */}
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Booking History
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilters({ status: '', search: '', sort: 'newest' })}
                className="border-gray-300 dark:border-gray-600"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 dark:border-gray-600"
                as="a"
                href="/rooms"
              >
                <Eye className="w-4 h-4 mr-2" />
                Book New
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Select
              options={[
                { value: '', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'checked_in', label: 'Checked In' },
                { value: 'checked_out', label: 'Checked Out' }
              ]}
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              className="min-w-[150px]"
            />
            <Select
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'price_high', label: 'Price: High to Low' },
                { value: 'price_low', label: 'Price: Low to High' }
              ]}
              value={filters.sort}
              onChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}
              className="min-w-[150px]"
            />
          </div>

          {/* Status Filter Quick Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { status: '', label: 'All', count: bookings.length, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
              { status: 'pending', label: 'Pending', count: getStatusCount('pending'), color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
              { status: 'confirmed', label: 'Confirmed', count: getStatusCount('confirmed'), color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
              { status: 'checked_in', label: 'Active', count: getStatusCount('checked_in'), color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
              { status: 'checked_out', label: 'Completed', count: getStatusCount('checked_out'), color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
              { status: 'cancelled', label: 'Cancelled', count: getStatusCount('cancelled'), color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setFilters(prev => ({ ...prev, status: item.status }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filters.status === item.status 
                    ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' 
                    : 'hover:opacity-90'
                } ${item.color}`}
              >
                {item.label}
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-white/50 dark:bg-black/50">
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Booking Table */}
          {isLoading ? (
            <div className="space-y-4 py-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
              <div className="min-w-full">
                <BookingTable isAdmin={false} />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 text-gray-400">
                <Calendar className="w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {filters.search || filters.status ? 'No matching bookings found' : 'No bookings yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                {filters.search || filters.status 
                  ? 'Try adjusting your search criteria or clear filters'
                  : 'Start your journey by booking your first stay with us'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(filters.search || filters.status) && (
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({ status: '', search: '', sort: 'newest' })}
                  >
                    Clear Filters
                  </Button>
                )}
                <Button 
                  as="a" 
                  href="/rooms"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Browse Rooms
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Booking Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Help & Support */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Need Help With Your Booking?
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <h4 className="font-medium text-gray-900 dark:text-white">24/7 Support</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Call us anytime at <span className="font-semibold text-primary">1-800-STAYSYNC</span> for immediate assistance with your bookings.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Payment Issues</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Having trouble with payments? Contact our billing department or check your payment methods in settings.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Document Requests</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need invoices or booking confirmations? Download them from your booking details or request via email.
                </p>
              </div>
            </div>
          </Card>

          {/* Policies & Tips */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-secondary/10 to-primary/10">
                <Shield className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Booking Policies & Tips
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-secondary">Cancellation Policy</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Free cancellation up to 24 hours before check-in. Some promotional rates may be non-refundable.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-secondary">Check-in/Check-out</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Standard check-in: 3:00 PM | Check-out: 11:00 AM. Early check-in and late check-out available upon request and subject to availability.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-secondary">Modifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Booking modifications can be made up to 48 hours before check-in through your dashboard or by contacting support.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-secondary">Loyalty Points</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Earn loyalty points with every stay. Redeem points for room upgrades, late check-outs, and exclusive offers.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default MyBookings