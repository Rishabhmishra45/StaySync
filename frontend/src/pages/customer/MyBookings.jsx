import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Filter, Calendar, Download, Printer, Share2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { bookingsService } from '../../services/api/bookings'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import BookingTable from '../../components/dashboard/BookingTable'
import { formatCurrency, calculateNights } from '../../utils/formatters'

const MyBookings = () => {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sort: 'newest'
  })

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings', filters],
    queryFn: bookingsService.getMyBookings
  })

  const filteredBookings = bookings?.filter(booking => {
    if (filters.status && booking.status !== filters.status) return false
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        booking._id.toLowerCase().includes(searchLower) ||
        booking.room?.name.toLowerCase().includes(searchLower)
      )
    }
    return true
  }) || []

  const totalSpent = filteredBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  const averageStay = filteredBookings.length > 0 
    ? filteredBookings.reduce((sum, b) => sum + calculateNights(b.checkIn, b.checkOut), 0) / filteredBookings.length
    : 0

  return (
    <>
      <Helmet>
        <title>My Bookings - StaySynce</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and track all your reservations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {filteredBookings.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Stay</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {averageStay.toFixed(1)} nights
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Reservations
            </h2>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Search bookings..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
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
            />
          </div>

          <BookingTable isAdmin={false} />
        </Card>

        {/* Booking Tips */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Booking Tips & Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Cancellation Policy</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Free cancellation up to 24 hours before check-in. Some rates may be non-refundable.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Check-in/out</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check-in: 3:00 PM | Check-out: 11:00 AM. Early check-in/late check-out subject to availability.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Need Help?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contact our 24/7 support team for any questions about your bookings.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default MyBookings