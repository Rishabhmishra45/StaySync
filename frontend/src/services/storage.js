// src/services/storage.js
export const storage = {
  setToken: (token) => {
    localStorage.setItem('staysynce_token', token)
  },

  getToken: () => {
    return localStorage.getItem('staysynce_token')
  },

  clearToken: () => {
    localStorage.removeItem('staysynce_token')
  },

  setTheme: (theme) => {
    localStorage.setItem('staysynce_theme', theme)
  },

  getTheme: () => {
    return localStorage.getItem('staysynce_theme')
  }
}