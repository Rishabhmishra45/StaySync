import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, Filter, Search, Home, CheckCircle, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { roomsService } from '../../services/api/rooms'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table from '../../components/ui/Table'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatCurrency } from '../../utils/formatters'

const ManageRooms = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    available: ''
  })
  const [roomToDelete, setRoomToDelete] = useState(null)

  const { data: rooms, isLoading, refetch } = useQuery({
    queryKey: ['admin-rooms', filters],
    queryFn: () => roomsService.getAll(filters)
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => roomsService.delete(id),
    onSuccess: () => {
      toast.success('Room deleted successfully')
      setRoomToDelete(null)
      refetch()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete room')
    }
  })

  const toggleAvailability = useMutation({
    mutationFn: ({ id, available }) => roomsService.update(id, { available }),
    onSuccess: () => {
      toast.success('Room availability updated')
      refetch()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update room')
    }
  })

  const columns = [
    {
      title: 'Room',
      dataIndex: 'name',
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={record.images?.[0]}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{record.type}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Price',
      dataIndex: 'pricePerNight',
      render: (price) => (
        <span className="font-bold text-primary">{formatCurrency(price)}</span>
      )
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      render: (capacity) => (
        <div className="flex items-center">
          <Users className="w-4 h-4 text-gray-500 mr-1" />
          <span>{capacity} Guests</span>
        </div>
      )
    },
    {
      title: 'Size',
      dataIndex: 'size',
      render: (size) => `${size} sqft`
    },
    {
      title: 'Status',
      dataIndex: 'available',
      render: (available) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          available
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {available ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              Available
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3 mr-1" />
              Booked
            </>
          )}
        </span>
      )
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      render: (featured) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          featured
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {featured ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id, record) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/rooms/${id}`)}
            className="p-1.5"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/rooms/edit/${id}`)}
            className="p-1.5"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleAvailability.mutate({ id, available: !record.available })}
            className="p-1.5"
            loading={toggleAvailability.isPending}
          >
            {record.available ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRoomToDelete(record)}
            className="p-1.5 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  const filteredRooms = rooms?.filter(room => {
    if (filters.search && !room.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.type && room.type !== filters.type) {
      return false
    }
    if (filters.available !== '' && room.available !== (filters.available === 'true')) {
      return false
    }
    return true
  }) || []

  return (
    <>
      <Helmet>
        <title>Manage Rooms - StaySynce Admin</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Rooms
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Add, edit, and manage hotel rooms
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/rooms/create')}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Room
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Rooms
            </h2>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Search rooms..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              icon={<Search className="w-5 h-5" />}
            />
            <Select
              options={[
                { value: '', label: 'All Types' },
                { value: 'single', label: 'Single' },
                { value: 'double', label: 'Double' },
                { value: 'suite', label: 'Suite' },
                { value: 'deluxe', label: 'Deluxe' },
                { value: 'presidential', label: 'Presidential' }
              ]}
              value={filters.type}
              onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            />
            <Select
              options={[
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Available' },
                { value: 'false', label: 'Booked' }
              ]}
              value={filters.available}
              onChange={(value) => setFilters(prev => ({ ...prev, available: value }))}
            />
          </div>

          <Table
            columns={columns}
            data={filteredRooms}
            loading={isLoading}
            emptyMessage="No rooms found"
          />
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
              <Home className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {rooms?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Rooms</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {rooms?.filter(r => r.available)?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Available Now</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 mb-4">
              <Home className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {rooms?.filter(r => r.featured)?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mb-4">
              <Home className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {rooms?.reduce((sum, r) => sum + (r.pricePerNight || 0), 0) / (rooms?.length || 1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Price</div>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!roomToDelete}
          onClose={() => setRoomToDelete(null)}
          onConfirm={() => deleteMutation.mutate(roomToDelete?._id)}
          title="Delete Room"
          message={`Are you sure you want to delete "${roomToDelete?.name}"? This action cannot be undone.`}
          confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete Room'}
          cancelText="Cancel"
          loading={deleteMutation.isPending}
          variant="danger"
        />
      </div>
    </>
  )
}

export default ManageRooms