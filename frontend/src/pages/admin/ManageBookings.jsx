import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Filter, Download, Calendar, Users, TrendingUp, Search } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { bookingsService } from '../../services/api/bookings'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import BookingTable from '../../components/dashboard/BookingTable'
import { formatCurrency } from '../../utils/formatters'

const ManageBookings = () => {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    sort: 'newest'
  })

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings', filters],
    queryFn: () => bookingsService.getAll(filters)
  })

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings?.length || 0,
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Pending Approval',
      value: bookings?.filter(b => b.status === 'pending')?.length || 0,
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Active Guests',
      value: bookings?.filter(b => b.status === 'checked_in')?.length || 0,
      icon: <Users className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Revenue Today',
      value: formatCurrency(bookings?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Manage Bookings - StaySynce Admin</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage all hotel reservations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="w-5 h-5 mr-2" />
              Export CSV
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              New Booking
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                      {stat.icon}
                    </div>
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

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Bookings
            </h2>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Search bookings..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              icon={<Search className="w-5 h-5" />}
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
            <Input
              type="date"
              placeholder="From Date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            />
            <Input
              type="date"
              placeholder="To Date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            />
          </div>

          <BookingTable isAdmin={true} />
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Booking Status Distribution
            </h3>
            <div className="space-y-3">
              {['confirmed', 'pending', 'checked_in', 'checked_out', 'cancelled'].map((status) => {
                const count = bookings?.filter(b => b.status === status)?.length || 0
                const percentage = bookings?.length ? (count / bookings.length) * 100 : 0
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Bulk Approve Pending
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Send Reminders
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Update Room Status
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Generate Reports
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Today's Check-ins/outs
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check-ins Today</p>
                <p className="text-2xl font-bold text-primary">12</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check-outs Today</p>
                <p className="text-2xl font-bold text-secondary">8</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expected Arrivals</p>
                <p className="text-2xl font-bold text-green-500">15</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default ManageBookings