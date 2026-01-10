import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, Camera, Save, Shield, Bell, CreditCard } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../app/providers/AuthProvider'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { validateEmail, validatePhone } from '../../utils/validators'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').refine(validateEmail, 'Valid email required'),
  phone: z.string().optional().refine(val => !val || validatePhone(val), 'Invalid phone'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional()
}).refine(data => {
  if (data.newPassword && !data.currentPassword) {
    return false
  }
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false
  }
  return true
}, {
  message: "Passwords don't match or current password is required",
  path: ["confirmPassword"]
})

const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      // In real app, call API to update profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateProfile(data)
      return data
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      reset(data)
    },
    onError: () => {
      toast.error('Failed to update profile')
    }
  })

  const onSubmit = (data) => {
    // Remove password fields if not changing password
    if (!data.newPassword) {
      delete data.currentPassword
      delete data.newPassword
      delete data.confirmPassword
    }
    updateMutation.mutate(data)
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> }
  ]

  return (
    <>
      <Helmet>
        <title>Profile - StaySynce</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          {isEditing ? (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  reset()
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="profile-form"
                loading={updateMutation.isPending}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                          {user?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Camera className="w-4 h-4" />
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold mt-4">{user?.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                  <div className="mt-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Info */}
                {activeTab === 'personal' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        icon={<User className="w-5 h-5" />}
                        disabled={!isEditing}
                        error={errors.name?.message}
                        {...register('name')}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        icon={<Mail className="w-5 h-5" />}
                        disabled={!isEditing}
                        error={errors.email?.message}
                        {...register('email')}
                      />
                      <Input
                        label="Phone Number"
                        icon={<Phone className="w-5 h-5" />}
                        disabled={!isEditing}
                        error={errors.phone?.message}
                        {...register('phone')}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Security */}
                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Security Settings
                    </h3>
                    <div className="space-y-6">
                      <Input
                        label="Current Password"
                        type="password"
                        icon={<Lock className="w-5 h-5" />}
                        disabled={!isEditing}
                        error={errors.currentPassword?.message}
                        {...register('currentPassword')}
                      />
                      <Input
                        label="New Password"
                        type="password"
                        icon={<Lock className="w-5 h-5" />}
                        disabled={!isEditing}
                        error={errors.newPassword?.message}
                        {...register('newPassword')}
                      />
                      <Input
                        label="Confirm New Password"
                        type="password"
                        icon={<Lock className="w-5 h-5" />}
                        disabled={!isEditing}
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      {[
                        'Booking confirmations and updates',
                        'Special offers and promotions',
                        'Account security alerts',
                        'Newsletter and updates',
                        'Review reminders'
                      ].map((preference) => (
                        <label key={preference} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <span className="text-gray-700 dark:text-gray-300">{preference}</span>
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Billing */}
                {activeTab === 'billing' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Billing Information
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-6 h-6 text-gray-500" />
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/2025</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        + Add Payment Method
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            </Card>

            {/* Account Stats */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed Stays</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-500">2</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">$4,280</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage