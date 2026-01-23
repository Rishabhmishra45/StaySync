import api from './axios'

export const citiesService = {
  getByState: async (stateId) => {
    try {
      const response = await api.get(`/cities/state/${stateId}`)
      return response.data
    } catch (error) {
      console.error('Get cities by state error:', error)
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch cities'
      }
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/cities/${id}`)
      return response.data
    } catch (error) {
      console.error('Get city error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch city'
      }
    }
  },
  
  create: async (data) => {
    try {
      const response = await api.post('/cities', data)
      return response.data
    } catch (error) {
      console.error('Create city error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to create city'
      }
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await api.put(`/cities/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Update city error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update city'
      }
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/cities/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete city error:', error)
      return {
        success: false,
        message: error.message || 'Failed to delete city'
      }
    }
  }
}