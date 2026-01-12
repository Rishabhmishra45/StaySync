// src/app/routes/AppRoutes.jsx (Updated)
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AuthGuard from '../guards/AuthGuard'
import RoleGuard from '../guards/RoleGuard'

// Public Pages
import HomePage from '../../pages/public/HomePage'
import RoomsPage from '../../pages/public/RoomsPage'
import RoomDetailsPage from '../../pages/public/RoomDetailsPage'
import LoginPage from '../../pages/auth/LoginPage'
import RegisterPage from '../../pages/auth/RegisterPage'
import NotFoundPage from '../../pages/public/NotFoundPage'
import AboutPage from '../../pages/public/AboutPage'
import ContactPage from '../../pages/public/ContactPage'

// Customer Pages
import CustomerDashboard from '../../pages/customer/Dashboard'
import MyBookings from '../../pages/customer/MyBookings'
import ProfilePage from '../../pages/customer/ProfilePage'

// Admin Pages
import AdminDashboard from '../../pages/admin/Dashboard'
import ManageBookings from '../../pages/admin/ManageBookings'
import ManageRooms from '../../pages/admin/ManageRooms'
import ManageUsers from '../../pages/admin/ManageUsers'
import AdminSettings from '../../pages/admin/Settings'
import CreateRoom from '../../pages/admin/CreateRoom'
import AdminAnalytics from '../../pages/admin/Analytics'
import AdminReports from '../../pages/admin/Reports'

import TestTheme from '../../pages/public/TestTheme'

const AppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="rooms/:id" element={<RoomDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="test-theme" element={<TestTheme />} />
        </Route>

        {/* Customer Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <RoleGuard requiredRole="admin">
                <AdminLayout />
              </RoleGuard>
            </AuthGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="rooms/create" element={<CreateRoom />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default AppRoutes