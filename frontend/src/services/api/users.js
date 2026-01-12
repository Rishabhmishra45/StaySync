// src/services/api/users.js
import api from './axios'

export const usersService = {
    getAll: async (params = {}) => {
        const response = await api.get('/users', { params })
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/users/${id}`)
        return response.data
    },

    update: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData)
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/users/${id}`)
        return response.data
    },

    toggleActive: async (id) => {
        const response = await api.patch(`/users/${id}/toggle-active`)
        return response.data
    }
}