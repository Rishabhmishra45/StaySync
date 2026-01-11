// src/services/api/rooms.js
import api from './axios'

export const roomsService = {
  // Get all rooms with filters
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/api/rooms', { params })
      
      // Handle different response structures
      let rooms = []
      let meta = {}
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          rooms = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          rooms = response.data.data
          meta = response.data.meta || response.data.pagination || {}
        } else if (response.data.rooms && Array.isArray(response.data.rooms)) {
          rooms = response.data.rooms
          meta = response.data.meta || response.data.pagination || {}
        } else if (typeof response.data === 'object') {
          // Try to find any array in the response
          const arrays = Object.values(response.data).filter(Array.isArray)
          if (arrays.length > 0) {
            rooms = arrays[0]
          }
        }
      }
      
      return {
        success: true,
        data: rooms,
        meta,
        total: rooms.length,
        message: response.data?.message || 'Rooms retrieved successfully'
      }
    } catch (error) {
      console.error('Get rooms error:', error)
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch rooms',
        error
      }
    }
  },

  // Get featured rooms
  getFeatured: async () => {
    try {
      const response = await api.get('/api/rooms/featured')
      
      let rooms = []
      if (response.data) {
        if (Array.isArray(response.data)) {
          rooms = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          rooms = response.data.data
        } else if (response.data.rooms && Array.isArray(response.data.rooms)) {
          rooms = response.data.rooms
        }
      }
      
      return {
        success: true,
        data: rooms,
        message: response.data?.message || 'Featured rooms retrieved successfully'
      }
    } catch (error) {
      console.error('Get featured rooms error:', error)
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch featured rooms',
        error
      }
    }
  },

  // Get single room by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/rooms/${id}`)
      
      let room = null
      if (response.data) {
        room = response.data.room || response.data.data || response.data
      }
      
      if (!room) {
        throw new Error('Room not found')
      }
      
      return {
        success: true,
        data: room,
        message: response.data?.message || 'Room retrieved successfully'
      }
    } catch (error) {
      console.error('Get room by ID error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch room',
        error
      }
    }
  },

  // Check room availability
  checkAvailability: async (id, checkIn, checkOut) => {
    try {
      const response = await api.get(`/api/rooms/${id}/availability`, {
        params: { checkIn, checkOut }
      })
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Availability checked successfully'
      }
    } catch (error) {
      console.error('Check availability error:', error)
      return {
        success: false,
        data: { available: false },
        message: error.message || 'Failed to check availability',
        error
      }
    }
  },

  // Create room (admin only)
  create: async (roomData) => {
    try {
      const response = await api.post('/api/rooms', roomData)
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Room created successfully'
      }
    } catch (error) {
      console.error('Create room error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to create room',
        error
      }
    }
  },

  // Update room (admin only)
  update: async (id, roomData) => {
    try {
      const response = await api.put(`/api/rooms/${id}`, roomData)
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Room updated successfully'
      }
    } catch (error) {
      console.error('Update room error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update room',
        error
      }
    }
  },

  // Delete room (admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/rooms/${id}`)
      
      return {
        success: true,
        message: response.data?.message || 'Room deleted successfully'
      }
    } catch (error) {
      console.error('Delete room error:', error)
      return {
        success: false,
        message: error.message || 'Failed to delete room',
        error
      }
    }
  }
}