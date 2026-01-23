import React, { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Eye, Edit, Trash2, Calendar, User, Home, CheckCircle, XCircle, Clock } from 'lucide-react'
import { bookingsService } from '../../services/api/bookings'
import toast from 'react-hot-toast'
import Table from '../ui/Table'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Select from '../ui/Select'
import Input from '../ui/Input'
import ConfirmDialog from '../ui/ConfirmDialog'
import { formatDate, formatCurrency } from '../../utils/formatters'

const BookingTable = ({ isAdmin = false, className = '' }) => {
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  })
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)

  const { data: bookingsResponse, isLoading, refetch } = useQuery({
    queryKey: ['bookings', isAdmin, filters],
    queryFn: () => isAdmin 
      ? bookingsService.getAll(filters)
      : bookingsService.getMyBookings()
  })

  // Extract bookings from response
  const bookings = useMemo(() => {
    if (!bookingsResponse) return []
    
    if (Array.isArray(bookingsResponse)) {
      return bookingsResponse
    }
    
    if (bookingsResponse.data && Array.isArray(bookingsResponse.data)) {
      return bookingsResponse.data
    }
    
    if (bookingsResponse.success && Array.isArray(bookingsResponse.data)) {
      return bookingsResponse.data
    }
    
    console.warn('Unexpected bookings response format:', bookingsResponse)
    return []
  }, [bookingsResponse])

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => bookingsService.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Booking status updated')
      setShowStatusDialog(false)
      refetch()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  })

  const cancelMutation = useMutation({
    mutationFn: (id) => bookingsService.cancel(id),
    onSuccess: () => {
      toast.success('Booking cancelled')
      setShowCancelDialog(false)
      refetch()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    }
  })

  const getStatusBadge = (status) => {
    const variants = {
      pending: { color: 'warning', icon: <Clock className="w-3 h-3" /> },
      confirmed: { color: 'success', icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { color: 'danger', icon: <XCircle className="w-3 h-3" /> },
      checked_in: { color: 'primary', icon: <CheckCircle className="w-3 h-3" /> },
      checked_out: { color: 'info', icon: <CheckCircle className="w-3 h-3" /> }
    }
    
    const { color, icon } = variants[status] || { color: 'default', icon: null }
    
    return (
      <Badge variant={color} className="flex items-center gap-1">
        {icon}
        <span className="capitalize">{status.replace('_', ' ')}</span>
      </Badge>
    )
  }

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: '_id',
      render: (id) => (
        <span className="font-mono text-sm">#{id ? id.slice(-8) : 'N/A'}</span>
      )
    },
    {
      title: 'Room',
      dataIndex: 'room',
      render: (room) => (
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-gray-500" />
          <span>{room?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      title: 'Dates',
      dataIndex: 'checkIn',
      render: (checkIn, record) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {checkIn ? formatDate(checkIn) : 'N/A'} - {record.checkOut ? formatDate(record.checkOut) : 'N/A'}
          </span>
        </div>
      )
    },
    {
      title: 'Guest',
      dataIndex: 'user',
      render: (user) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span>{user?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      render: (amount) => amount ? formatCurrency(amount) : '$0'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => status ? getStatusBadge(status) : <Badge>Unknown</Badge>
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id, record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* View details */}}
            className="p-1.5"
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedBooking(record)
                setShowStatusDialog(true)
              }}
              className="p-1.5"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          
          {(isAdmin || record.status === 'pending') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedBooking(record)
                setShowCancelDialog(true)
              }}
              className="p-1.5 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  const filteredData = useMemo(() => {
    return bookings.filter(booking => {
      if (filters.status && booking.status !== filters.status) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          (booking._id && booking._id.toLowerCase().includes(searchLower)) ||
          (booking.room?.name && booking.room.name.toLowerCase().includes(searchLower)) ||
          (booking.user?.name && booking.user.name.toLowerCase().includes(searchLower))
        )
      }
      return true
    })
  }, [bookings, filters])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search bookings..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="md:w-64"
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
          className="md:w-48"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredData}
        loading={isLoading}
        emptyMessage="No bookings found"
      />

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => cancelMutation.mutate(selectedBooking?._id)}
        title="Cancel Booking"
        message={`Are you sure you want to cancel booking #${selectedBooking?._id?.slice(-8)}? This action cannot be undone.`}
        confirmText={cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
        cancelText="No, Keep"
        loading={cancelMutation.isPending}
      />

      {/* Status Update Dialog (Admin Only) */}
      {isAdmin && (
        <ConfirmDialog
          isOpen={showStatusDialog}
          onClose={() => setShowStatusDialog(false)}
          onConfirm={() => {
            // This would be a custom dialog with status selection
            // For now, just close
            setShowStatusDialog(false)
          }}
          title="Update Booking Status"
          message="Select new status for this booking"
          confirmText="Update"
          cancelText="Cancel"
          variant="primary"
        />
      )}
    </div>
  )
}

export default BookingTable