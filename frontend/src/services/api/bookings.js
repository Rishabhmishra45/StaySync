// src/services/api/bookings.js
import api from './axios'

export const bookingsService = {
  create: async (bookingData) => {
    const { data } = await api.post('/api/bookings', bookingData)
    return data
  },

  getMyBookings: async () => {
    const { data } = await api.get('/api/bookings/my')
    return data
  },

  getAll: async (params = {}) => {
    const { data } = await api.get('/api/bookings', { params })
    return data
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/api/bookings/${id}`, { status })
    return data
  },

  cancel: async (id) => {
    const { data } = await api.delete(`/api/bookings/${id}`)
    return data
  }
}