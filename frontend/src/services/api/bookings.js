import api from './axios'

export const bookingsService = {
  // Create a new booking
  create: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData)  // REMOVED /api prefix
      
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
      const response = await api.get('/bookings/my')  // REMOVED /api prefix
      
      // Extract bookings from response
      let bookings = []
      
      if (response.data) {
        // Case 1: Direct array
        if (Array.isArray(response.data)) {
          bookings = response.data
        }
        // Case 2: Response has data property
        else if (response.data.data && Array.isArray(response.data.data)) {
          bookings = response.data.data
        }
        // Case 3: Response has bookings property
        else if (response.data.bookings && Array.isArray(response.data.bookings)) {
          bookings = response.data.bookings
        }
        // Case 4: Response is object with success property
        else if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
          bookings = response.data.data
        }
      }
      
      return {
        success: true,
        data: bookings,
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
      const response = await api.get('/bookings', { params })  // REMOVED /api prefix
      
      // Extract bookings from response
      let bookings = []
      
      if (response.data) {
        // Case 1: Direct array
        if (Array.isArray(response.data)) {
          bookings = response.data
        }
        // Case 2: Response has data property
        else if (response.data.data && Array.isArray(response.data.data)) {
          bookings = response.data.data
        }
        // Case 3: Response has bookings property
        else if (response.data.bookings && Array.isArray(response.data.bookings)) {
          bookings = response.data.bookings
        }
        // Case 4: Response is object with success property
        else if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
          bookings = response.data.data
        }
      }
      
      return {
        success: true,
        data: bookings,
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
      const response = await api.get(`/bookings/${id}`)  // REMOVED /api prefix
      
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
      const response = await api.patch(`/bookings/${id}`, { status })  // REMOVED /api prefix
      
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
      const response = await api.put(`/bookings/${id}`, bookingData)  // REMOVED /api prefix
      
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
      const response = await api.delete(`/bookings/${id}`, { 
        data: { reason } 
      })  // REMOVED /api prefix
      
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
      const response = await api.get('/bookings/stats')  // REMOVED /api prefix
      
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