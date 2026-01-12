// src/services/api/auth.js
import api from "../api/axios";

export const authService = {
  // ✅ LOGIN (ADDED)
  login: async (credentials) => {
    try {
      console.log("Attempting login with data:", credentials);
      console.log("API base URL should be:", api.defaults.baseURL);

      const response = await api.post("/auth/login", credentials);

      console.log("Login response:", response.data);

      if (response.data && response.data.success) {
        const token = response.data.token;
        const user = response.data.user;

        if (token) {
          localStorage.setItem("staysync_token", token);
          if (user) {
            localStorage.setItem("staysync_user", JSON.stringify(user));
          }
        }

        return {
          success: true,
          token,
          user,
          message: response.data.message || "Login successful",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Invalid response from server",
      };
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        status: error.status,
        code: error.code,
        url: error.config?.url,
        fullError: error,
      });

      // ✅ Backend Offline / Network Error
      if (
        error.code === "ERR_NETWORK" ||
        error.code === "NETWORK_ERROR" ||
        error.status === 0 ||
        !error.response
      ) {
        return {
          success: false,
          message:
            "Cannot connect to server. Please make sure the backend is running on http://localhost:5000",
          backendOffline: true,
        };
      }

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please check if backend is running.",
        error: error.response?.data || error,
      };
    }
  },

  // ✅ REGISTER (your code preserved)
  register: async (userData) => {
    try {
      console.log("Attempting registration with data:", userData);
      console.log("API base URL should be:", api.defaults.baseURL);

      const response = await api.post("/auth/register", userData);

      console.log("Registration response:", response.data);

      if (response.data && response.data.success) {
        const token = response.data.token;
        const user = response.data.user;

        if (token) {
          localStorage.setItem("staysync_token", token);
          if (user) {
            localStorage.setItem("staysync_user", JSON.stringify(user));
          }
        }

        return {
          success: true,
          token,
          user,
          message: response.data.message || "Registration successful",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Invalid response from server",
      };
    } catch (error) {
      console.error("Registration error details:", {
        message: error.message,
        status: error.status,
        code: error.code,
        url: error.config?.url,
        fullError: error,
      });

      // ✅ Backend Offline / Network Error
      if (
        error.code === "ERR_NETWORK" ||
        error.code === "NETWORK_ERROR" ||
        error.status === 0 ||
        !error.response
      ) {
        return {
          success: false,
          message:
            "Cannot connect to server. Please make sure the backend is running on http://localhost:5000",
          backendOffline: true,
        };
      }

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration failed. Please check if backend is running.",
        error: error.response?.data || error,
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");

      if (response.data && response.data.success) {
        const user = response.data.user;

        if (user) {
          localStorage.setItem("staysync_user", JSON.stringify(user));
        }

        return {
          success: true,
          user,
          message: response.data.message || "User retrieved successfully",
        };
      } else {
        return {
          success: false,
          message: response.data?.message || "Invalid response from server",
        };
      }
    } catch (error) {
      console.error("Get current user error:", error);

      // Clear storage on auth errors
      if (error.response?.status === 401) {
        authService.clearStorage();
      }

      return {
        success: false,
        message: error.response?.data?.message || "Failed to get user data",
        error: error.response?.data || error,
      };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with client-side logout even if API call fails
    } finally {
      authService.clearStorage();
      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put("/auth/profile", userData);

      if (response.data && response.data.success) {
        const user = response.data.user;

        if (user) {
          localStorage.setItem("staysync_user", JSON.stringify(user));
        }

        return {
          success: true,
          user,
          message: response.data.message || "Profile updated successfully",
        };
      } else {
        return {
          success: false,
          message: response.data?.message || "Update failed",
        };
      }
    } catch (error) {
      console.error("Update profile error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
        error: error.response?.data || error,
      };
    }
  },

  // ✅ Utility methods (your code preserved)
  isAuthenticated: () => {
    const token = localStorage.getItem("staysync_token");
    return !!token;
  },

  getStoredUser: () => {
    try {
      const userStr = localStorage.getItem("staysync_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("staysync_token");
  },

  clearStorage: () => {
    localStorage.removeItem("staysync_token");
    localStorage.removeItem("staysync_user");
  },
};
