// src/pages/admin/ManageRooms.jsx
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, Filter, Search, Home, CheckCircle, XCircle, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { roomsService } from '../../services/api/rooms'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatCurrency } from '../../utils/formatters'

const ManageRooms = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    available: ''
  })
  const [roomToDelete, setRoomToDelete] = useState(null)

  // Fetch real rooms data
  const { data: roomsResponse, isLoading } = useQuery({
    queryKey: ['admin-rooms', filters],
    queryFn: () => roomsService.getAll(filters)
  })

  const rooms = roomsResponse?.data || roomsResponse || []

  const deleteMutation = useMutation({
    mutationFn: (id) => roomsService.delete(id),
    onSuccess: () => {
      toast.success('Room deleted successfully')
      setRoomToDelete(null)
      queryClient.invalidateQueries(['admin-rooms'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete room')
    }
  })

  const toggleAvailability = useMutation({
    mutationFn: ({ id, available }) => roomsService.update(id, { available: !available }),
    onSuccess: () => {
      toast.success('Room availability updated')
      queryClient.invalidateQueries(['admin-rooms'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update room')
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
              src={record.images?.[0]?.url || record.images?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{name}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{record.type}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Price',
      dataIndex: 'pricePerNight',
      render: (price) => (
        <span className="font-bold text-primary dark:text-primary-light">
          {formatCurrency(price || 0)}
        </span>
      )
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      render: (capacity) => (
        <div className="flex items-center">
          <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
          <span className="text-gray-800 dark:text-gray-200">{capacity || 2} Guests</span>
        </div>
      )
    },
    {
      title: 'Size',
      dataIndex: 'size',
      render: (size) => (
        <span className="text-gray-800 dark:text-gray-200">
          {size ? `${size} sqft` : 'N/A'}
        </span>
      )
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
            onClick={() => toggleAvailability.mutate({ id, available: record.available })}
            className="p-1.5"
            loading={toggleAvailability.variables?.id === id && toggleAvailability.isPending}
          >
            {record.available ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRoomToDelete(record)}
            className="p-1.5 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  const filteredRooms = rooms.filter(room => {
    if (filters.search && !room.name?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.type && room.type !== filters.type) {
      return false
    }
    if (filters.available !== '' && room.available !== (filters.available === 'true')) {
      return false
    }
    return true
  })

  return (
    <>
      <Helmet>
        <title>Manage Rooms - StaySync Admin</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Rooms
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
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
        <Card className="p-6 bg-white dark:bg-gray-800">
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

          {/* Rooms Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Capacity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Featured</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-600 dark:text-gray-400">
                      Loading rooms...
                    </td>
                  </tr>
                ) : filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-600 dark:text-gray-400">
                      No rooms found
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr key={room._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={room.images?.[0]?.url || room.images?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'}
                              alt={room.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{room.name}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{room.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-primary dark:text-primary-light">
                          {formatCurrency(room.pricePerNight || 0)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                          <span className="text-gray-800 dark:text-gray-200">{room.capacity || 2} Guests</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-800 dark:text-gray-200">
                          {room.size ? `${room.size} sqft` : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          room.available
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {room.available ? (
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
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          room.featured
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {room.featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/rooms/${room._id}`)}
                            className="p-1.5"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/rooms/edit/${room._id}`)}
                            className="p-1.5"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAvailability.mutate({ id: room._id, available: room.available })}
                            className="p-1.5"
                            loading={toggleAvailability.variables?.id === room._id && toggleAvailability.isPending}
                          >
                            {room.available ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRoomToDelete(room)}
                            className="p-1.5 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center bg-white dark:bg-gray-800">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
              <Home className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {rooms.length}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Total Rooms</div>
          </Card>

          <Card className="p-6 text-center bg-white dark:bg-gray-800">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {rooms.filter(r => r.available).length}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Available Now</div>
          </Card>

          <Card className="p-6 text-center bg-white dark:bg-gray-800">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 mb-4">
              <Home className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {rooms.filter(r => r.featured).length}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Featured</div>
          </Card>

          <Card className="p-6 text-center bg-white dark:bg-gray-800">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mb-4">
              <Home className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {rooms.length > 0 ? formatCurrency(rooms.reduce((sum, r) => sum + (r.pricePerNight || 0), 0) / rooms.length) : '$0'}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Avg. Price</div>
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