// src/services/api/rooms.js (UPDATED VERSION)
import api from './axios'

export const roomsService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/rooms', { params })
      return response.data
    } catch (error) {
      console.error('Get rooms error:', error)
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch rooms'
      }
    }
  },

  getFeatured: async () => {
    try {
      const response = await api.get('/rooms/featured')
      return response.data
    } catch (error) {
      console.error('Get featured rooms error:', error)
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch featured rooms'
      }
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/rooms/${id}`)
      return response.data
    } catch (error) {
      console.error('Get room by ID error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch room'
      }
    }
  },

  create: async (roomData) => {
    try {
      console.log('Creating room with data:', roomData)
      
      // Make sure data is in correct format
      const formattedData = {
        ...roomData,
        pricePerNight: Number(roomData.pricePerNight),
        capacity: Number(roomData.capacity),
        size: Number(roomData.size),
        bathrooms: Number(roomData.bathrooms),
        floor: Number(roomData.floor)
      }
      
      console.log('Formatted data for API:', formattedData)
      
      const response = await api.post('/rooms', formattedData)
      
      console.log('Room creation response:', response)
      
      return response.data
    } catch (error) {
      console.error('Create room error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to create room',
        error: error.response?.data
      }
    }
  },

  update: async (id, roomData) => {
    try {
      const response = await api.put(`/rooms/${id}`, roomData)
      return response.data
    } catch (error) {
      console.error('Update room error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update room'
      }
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/rooms/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete room error:', error)
      return {
        success: false,
        message: error.message || 'Failed to delete room'
      }
    }
  },

  checkAvailability: async (id, checkIn, checkOut) => {
    try {
      const response = await api.get(`/rooms/${id}/availability`, {
        params: { checkIn, checkOut }
      })
      return response.data
    } catch (error) {
      console.error('Check availability error:', error)
      return {
        success: false,
        data: { available: false },
        message: error.message || 'Failed to check availability'
      }
    }
  }
}