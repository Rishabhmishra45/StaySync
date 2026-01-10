// src/services/api/rooms.js
import api from './axios'

export const roomsService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/api/rooms', { params })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/api/rooms/${id}`)
    return data
  },

  create: async (roomData) => {
    const { data } = await api.post('/api/rooms', roomData)
    return data
  },

  update: async (id, roomData) => {
    const { data } = await api.patch(`/api/rooms/${id}`, roomData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/api/rooms/${id}`)
    return data
  }
}