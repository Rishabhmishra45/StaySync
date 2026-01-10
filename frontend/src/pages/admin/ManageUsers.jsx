import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Users, UserPlus, Mail, Phone, Shield, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table from '../../components/ui/Table'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatDate } from '../../utils/formatters'

// Mock data - in real app, you would fetch from API
const mockUsers = [
  {
    _id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    role: 'customer',
    status: 'active',
    createdAt: '2024-01-15',
    bookings: 12
  },
  {
    _id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 987-6543',
    role: 'customer',
    status: 'active',
    createdAt: '2024-01-10',
    bookings: 8
  },
  {
    _id: '3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+1 (555) 456-7890',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-05',
    bookings: 0
  },
  {
    _id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+1 (555) 234-5678',
    role: 'customer',
    status: 'inactive',
    createdAt: '2024-01-01',
    bookings: 3
  }
]

const ManageUsers = () => {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  })
  const [userToDelete, setUserToDelete] = useState(null)

  const { data: users = mockUsers, isLoading } = useQuery({
    queryKey: ['admin-users', filters],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockUsers
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: (id) => {
      toast.success('User deleted successfully')
      setUserToDelete(null)
    },
    onError: () => {
      toast.error('Failed to delete user')
    }
  })

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{record.email}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      render: (phone) => (
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span>{phone}</span>
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          role === 'admin'
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        }`}>
          <Shield className="w-3 h-3 mr-1" />
          {role === 'admin' ? 'Admin' : 'Customer'}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {status === 'active' ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3 mr-1" />
              Inactive
            </>
          )}
        </span>
      )
    },
    {
      title: 'Bookings',
      dataIndex: 'bookings',
      render: (bookings) => (
        <div className="text-center">
          <span className="font-bold text-primary">{bookings}</span>
        </div>
      )
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      render: (date) => formatDate(date)
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id, record) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Edit user */}}
            className="p-1.5"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {record.role !== 'admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserToDelete(record)}
              className="p-1.5 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  const filteredUsers = users.filter(user => {
    if (filters.search && !user.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.role && user.role !== filters.role) {
      return false
    }
    if (filters.status && user.status !== filters.status) {
      return false
    }
    return true
  })

  return (
    <>
      <Helmet>
        <title>Manage Users - StaySynce Admin</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Users
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage user accounts
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <UserPlus className="w-5 h-5 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {users.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Users
            </h2>
            <div className="flex items-center space-x-3">
              <Input
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Select
              options={[
                { value: '', label: 'All Roles' },
                { value: 'customer', label: 'Customer' },
                { value: 'admin', label: 'Admin' }
              ]}
              value={filters.role}
              onChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
            />
            <Select
              options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            />
          </div>

          <Table
            columns={columns}
            data={filteredUsers}
            loading={isLoading}
            emptyMessage="No users found"
          />
        </Card>

        {/* User Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              User Growth
            </h3>
            <div className="h-64 flex items-end space-x-2">
              {[30, 45, 60, 75, 90, 100, 120].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t"
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              User Distribution
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Customers</span>
                </div>
                <span className="font-bold">
                  {users.filter(u => u.role === 'customer').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>Admins</span>
                </div>
                <span className="font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Active</span>
                </div>
                <span className="font-bold">
                  {users.filter(u => u.status === 'active').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Inactive</span>
                </div>
                <span className="font-bold">
                  {users.filter(u => u.status === 'inactive').length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={() => deleteMutation.mutate(userToDelete?._id)}
          title="Delete User"
          message={`Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone.`}
          confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
          cancelText="Cancel"
          loading={deleteMutation.isPending}
          variant="danger"
        />
      </div>
    </>
  )
}

export default ManageUsers