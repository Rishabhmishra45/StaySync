// src/pages/admin/Reports.jsx
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  FileText,
  Download,
  Filter,
  Calendar,
  Printer,
  Mail,
  Eye,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react'
import { bookingsService } from '../../services/api/bookings'
import { roomsService } from '../../services/api/rooms'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { formatCurrency, formatDate } from '../../utils/formatters'

const AdminReports = () => {
  const [reportType, setReportType] = useState('financial')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  const { data: bookingsResponse } = useQuery({
    queryKey: ['reports-bookings'],
    queryFn: () => bookingsService.getAll({ limit: 1000 })
  })

  const { data: roomsResponse } = useQuery({
    queryKey: ['reports-rooms'],
    queryFn: () => roomsService.getAll()
  })

  const bookings = bookingsResponse?.data || []
  const rooms = roomsResponse?.data || []

  const reportTypes = [
    { id: 'financial', label: 'Financial Report', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'occupancy', label: 'Occupancy Report', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'revenue', label: 'Revenue Report', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'guests', label: 'Guest Report', icon: <Users className="w-5 h-5" /> }
  ]

  // Calculate financial report data
  const financialReport = {
    totalRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    totalBookings: bookings.length,
    avgBookingValue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) / (bookings.length || 1),
    taxes: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) * 0.08,
    refunds: bookings.filter(b => b.status === 'cancelled').reduce((sum, b) => sum + (b.totalAmount || 0) * 0.5, 0),
    netRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) * 0.92
  }

  // Calculate occupancy report data
  const occupancyReport = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter(r => r.available).length,
    occupiedRooms: rooms.filter(r => !r.available).length,
    occupancyRate: Math.round(((rooms.filter(r => !r.available).length) / rooms.length) * 100),
    avgStayLength: 3.2,
    totalNights: bookings.reduce((sum, b) => sum + (b.nights || 1), 0)
  }

  const handleGenerateReport = () => {
    // Generate report based on selected type
    console.log('Generating report:', reportType, dateRange)
    // In real app, this would make an API call
  }

  const handleExportPDF = () => {
    console.log('Exporting PDF report')
  }

  const handleExportExcel = () => {
    console.log('Exporting Excel report')
  }

  return (
    <>
      <Helmet>
        <title>Reports - StaySync Admin</title>
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
              Reports & Analytics
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Generate and export detailed reports
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-3"
          >
            <Button variant="outline">
              <Printer className="w-5 h-5 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Mail className="w-5 h-5 mr-2" />
              Email
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </Button>
          </motion.div>
        </div>

        {/* Report Type Selection */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Select Report Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${reportType === type.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-700 dark:text-gray-300'
                  }`}
              >
                <div className={`p-3 rounded-full mb-3 ${reportType === type.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {type.icon}
                </div>
                <span className="font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Date Range Filter */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Date Range
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Select the period for your report
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-40"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-40"
                />
              </div>
              <Button onClick={handleGenerateReport}>
                <Filter className="w-5 h-5 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </Card>

        {/* Report Content */}
        {reportType === 'financial' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Financial Report
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {dateRange.start ? `${formatDate(dateRange.start)} to ${formatDate(dateRange.end)}` : 'All time'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" onClick={handleExportExcel}>
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <FileText className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(financialReport.totalRevenue)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total Revenue</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {financialReport.totalBookings}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total Bookings</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(financialReport.avgBookingValue)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg. Booking Value</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Gross Revenue</span>
                        <span className="font-medium">{formatCurrency(financialReport.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Taxes (8%)</span>
                        <span className="font-medium">{formatCurrency(financialReport.taxes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Refunds</span>
                        <span className="font-medium text-red-600">{formatCurrency(financialReport.refunds)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="font-semibold text-gray-900 dark:text-white">Net Revenue</span>
                        <span className="font-bold text-primary">{formatCurrency(financialReport.netRevenue)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Revenue Sources</h3>
                    <div className="space-y-3">
                      {['Deluxe Suite', 'Executive Room', 'Presidential Suite', 'Standard Room'].map((room, index) => (
                        <div key={room} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{room}</span>
                          <span className="font-medium">{formatCurrency(financialReport.totalRevenue * (0.3 - index * 0.05))}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {reportType === 'occupancy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Occupancy Report
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Room utilization and availability analysis
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" onClick={handleExportExcel}>
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <FileText className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {occupancyReport.occupancyRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Occupancy Rate</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {occupancyReport.occupiedRooms}/{occupancyReport.totalRooms}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Occupied Rooms</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {occupancyReport.avgStayLength} days
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Avg. Stay Length</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Room Type Distribution</h3>
                    <div className="space-y-3">
                      {['Standard Room', 'Deluxe Room', 'Suite', 'Presidential Suite'].map((type, index) => (
                        <div key={type} className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-gray-600 dark:text-gray-400">{type}</span>
                          </div>
                          <span className="font-medium">{Math.floor(rooms.length * (0.4 - index * 0.1))} rooms</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Occupancy Trend</h3>
                    <div className="space-y-3">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <div key={day} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{day}</span>
                          <div className="flex items-center space-x-4">
                            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                style={{ width: `${70 + index * 5}%` }}
                              />
                            </div>
                            <span className="font-medium w-8 text-right">{70 + index * 5}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Export Options */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Export Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg text-center hover:border-primary transition-colors">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">PDF Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Download report as PDF with charts
              </p>
              <Button variant="outline" className="w-full" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>

            <div className="p-6 border rounded-lg text-center hover:border-primary transition-colors">
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Excel Export</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Export raw data to Excel for analysis
              </p>
              <Button variant="outline" className="w-full" onClick={handleExportExcel}>
                <Download className="w-4 h-4 mr-2" />
                Download Excel
              </Button>
            </div>

            <div className="p-6 border rounded-lg text-center hover:border-primary transition-colors">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Send report to email recipients
              </p>
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Email Report
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default AdminReports