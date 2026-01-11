// src/services/api/bookings.js
import api from './axios'

export const bookingsService = {
  // Create a new booking
  create: async (bookingData) => {
    try {
      const response = await api.post('/api/bookings', bookingData)
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Booking created successfully'
      }
    } catch (error) {
      console.error('Create booking error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to create booking',
        error
      }
    }
  },

  // Get user's bookings
  getMyBookings: async () => {
    try {
      const response = await api.get('/api/bookings/my')
      
      let bookings = []
      let meta = {}
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          bookings = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          bookings = response.data.data
          meta = response.data.meta || response.data.pagination || {}
        } else if (response.data.bookings && Array.isArray(response.data.bookings)) {
          bookings = response.data.bookings
          meta = response.data.meta || response.data.pagination || {}
        } else if (typeof response.data === 'object') {
          // Try to find any array in the response
          const arrays = Object.values(response.data).filter(Array.isArray)
          if (arrays.length > 0) {
            bookings = arrays[0]
          }
        }
      }
      
      return {
        success: true,
        data: bookings,
        meta,
        total: bookings.length,
        message: response.data?.message || 'Bookings retrieved successfully'
      }
    } catch (error) {
      console.error('Get my bookings error:', error)
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch bookings',
        error
      }
    }
  },

  // Get all bookings (admin only)
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/api/bookings', { params })
      
      let bookings = []
      let meta = {}
      let pagination = {}
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          bookings = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          bookings = response.data.data
          meta = response.data.meta || {}
          pagination = response.data.pagination || {}
        } else if (response.data.bookings && Array.isArray(response.data.bookings)) {
          bookings = response.data.bookings
          meta = response.data.meta || {}
          pagination = response.data.pagination || {}
        }
      }
      
      return {
        success: true,
        data: bookings,
        meta,
        pagination,
        total: bookings.length,
        message: response.data?.message || 'Bookings retrieved successfully'
      }
    } catch (error) {
      console.error('Get all bookings error:', error)
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch bookings',
        error
      }
    }
  },

  // Get booking by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/bookings/${id}`)
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Booking retrieved successfully'
      }
    } catch (error) {
      console.error('Get booking by ID error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch booking',
        error
      }
    }
  },

  // Update booking status (admin only)
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/api/bookings/${id}`, { status })
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Booking updated successfully'
      }
    } catch (error) {
      console.error('Update booking status error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update booking',
        error
      }
    }
  },

  // Update booking (admin only)
  update: async (id, bookingData) => {
    try {
      const response = await api.put(`/api/bookings/${id}`, bookingData)
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Booking updated successfully'
      }
    } catch (error) {
      console.error('Update booking error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update booking',
        error
      }
    }
  },

  // Cancel booking
  cancel: async (id, reason) => {
    try {
      const response = await api.delete(`/api/bookings/${id}`, { 
        data: { reason } 
      })
      
      return {
        success: true,
        message: response.data?.message || 'Booking cancelled successfully'
      }
    } catch (error) {
      console.error('Cancel booking error:', error)
      return {
        success: false,
        message: error.message || 'Failed to cancel booking',
        error
      }
    }
  },

  // Get booking statistics (admin only)
  getStats: async () => {
    try {
      const response = await api.get('/api/bookings/stats')
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Statistics retrieved successfully'
      }
    } catch (error) {
      console.error('Get booking stats error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch statistics',
        error
      }
    }
  }
}