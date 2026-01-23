import api from './axios'

export const statesService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/states', { params })
      return response.data
    } catch (error) {
      console.error('Get states error:', error)
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch states'
      }
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/states/${id}`)
      return response.data
    } catch (error) {
      console.error('Get state error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch state'
      }
    }
  },
  
  getFeatured: async () => {
    try {
      const response = await api.get('/states/featured')
      return response.data
    } catch (error) {
      console.error('Get featured states error:', error)
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch featured states'
      }
    }
  },
  
  create: async (data) => {
    try {
      const response = await api.post('/states', data)
      return response.data
    } catch (error) {
      console.error('Create state error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to create state'
      }
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await api.put(`/states/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Update state error:', error)
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update state'
      }
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/states/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete state error:', error)
      return {
        success: false,
        message: error.message || 'Failed to delete state'
      }
    }
  }
}