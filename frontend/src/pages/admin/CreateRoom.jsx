import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { roomsService } from '../../services/api/rooms'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import RoomForm from '../../components/dashboard/RoomForm'

const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  type: z.enum(['single', 'double', 'suite', 'deluxe', 'presidential']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  pricePerNight: z.coerce.number().min(1, 'Price must be greater than 0'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  size: z.coerce.number().min(1, 'Size must be at least 1'),
  beds: z.string().min(1, 'Beds information is required'),
  bathrooms: z.coerce.number().min(1, 'At least 1 bathroom is required'),
  floor: z.coerce.number().min(1, 'Floor is required'),
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
  parkingIncluded: z.boolean().default(false),
  breakfastIncluded: z.boolean().default(false)
})

const CreateRoom = () => {
  const navigate = useNavigate()
  const [images, setImages] = useState([])

  const createMutation = useMutation({
    mutationFn: (roomData) => roomsService.create(roomData),
    onSuccess: () => {
      toast.success('Room created successfully!')
      navigate('/admin/rooms')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create room')
    }
  })

  const { handleSubmit } = useForm({
    resolver: zodResolver(roomSchema)
  })

  const handleCreateRoom = (data) => {
    const roomData = {
      ...data,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800']
    }
    createMutation.mutate(roomData)
  }

  return (
    <>
      <Helmet>
        <title>Create New Room - StaySynce Admin</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/rooms')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Room
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Add a new room to your hotel inventory
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/rooms')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="room-form"
              loading={createMutation.isPending}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <Save className="w-5 h-5 mr-2" />
              Create Room
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Room Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Fill in the details to add a new room to your hotel
              </p>
            </div>

            <RoomForm
              onSubmit={handleCreateRoom}
              loading={createMutation.isPending}
            />
          </Card>
        </motion.div>

        {/* Tips */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Room Creation Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Images</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload high-quality images showing different angles of the room.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Be detailed about amenities, views, and special features.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Pricing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Consider seasonality and competitive pricing in your area.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default CreateRoom