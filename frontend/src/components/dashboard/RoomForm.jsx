import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'

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
  breakfastIncluded: z.boolean().default(false),
  amenities: z.array(z.string()).default([])
})

const RoomForm = ({ 
  initialData, 
  onSubmit, 
  loading = false,
  className = '' 
}) => {
  const [images, setImages] = React.useState(initialData?.images || [])
  const [amenities, setAmenities] = React.useState(initialData?.amenities || [])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: initialData || {
      name: '',
      type: 'single',
      description: '',
      pricePerNight: 100,
      capacity: 2,
      size: 300,
      beds: '1 King Bed',
      bathrooms: 1,
      floor: 1,
      featured: false,
      available: true,
      parkingIncluded: false,
      breakfastIncluded: false,
      amenities: []
    }
  })

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // In real app, you would upload to cloud storage
    // For demo, create object URLs
    const newImages = files.map(file => URL.createObjectURL(file))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity) => {
    setAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const handleFormSubmit = (data) => {
    const formData = {
      ...data,
      images,
      amenities
    }
    onSubmit(formData)
  }

  const amenityOptions = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'tv', label: 'TV' },
    { value: 'ac', label: 'Air Conditioning' },
    { value: 'heating', label: 'Heating' },
    { value: 'minibar', label: 'Minibar' },
    { value: 'safe', label: 'Safe' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'pool_view', label: 'Pool View' },
    { value: 'sea_view', label: 'Sea View' }
  ]

  const roomTypes = [
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'presidential', label: 'Presidential Suite' }
  ]

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-6 ${className}`}>
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Room Name"
          placeholder="Deluxe Ocean View Suite"
          error={errors.name?.message}
          disabled={loading}
          {...register('name')}
        />

        <Select
          label="Room Type"
          options={roomTypes}
          error={errors.type?.message}
          disabled={loading}
          {...register('type')}
        />

        <Input
          label="Price Per Night ($)"
          type="number"
          placeholder="199"
          error={errors.pricePerNight?.message}
          disabled={loading}
          {...register('pricePerNight')}
        />

        <Input
          label="Capacity (Guests)"
          type="number"
          placeholder="2"
          error={errors.capacity?.message}
          disabled={loading}
          {...register('capacity')}
        />

        <Input
          label="Room Size (sqft)"
          type="number"
          placeholder="300"
          error={errors.size?.message}
          disabled={loading}
          {...register('size')}
        />

        <Input
          label="Beds"
          placeholder="1 King Bed, 2 Twin Beds"
          error={errors.beds?.message}
          disabled={loading}
          {...register('beds')}
        />

        <Input
          label="Bathrooms"
          type="number"
          placeholder="1"
          error={errors.bathrooms?.message}
          disabled={loading}
          {...register('bathrooms')}
        />

        <Input
          label="Floor"
          type="number"
          placeholder="1"
          error={errors.floor?.message}
          disabled={loading}
          {...register('floor')}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Describe the room features, view, and special amenities..."
        rows={4}
        error={errors.description?.message}
        disabled={loading}
        {...register('description')}
      />

      {/* Images Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Room Images
        </label>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-primary transition-colors">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Drag & drop images here or click to browse
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="room-images"
            />
            <label htmlFor="room-images">
              <Button type="button" variant="outline" size="sm">
                Select Images
              </Button>
            </label>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Room image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenityOptions.map((amenity) => (
            <label
              key={amenity.value}
              className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={amenities.includes(amenity.value)}
                onChange={() => toggleAmenity(amenity.value)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('featured')}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">Featured Room</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('available')}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">Available for Booking</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('parkingIncluded')}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">Parking Included</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('breakfastIncluded')}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">Breakfast Included</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="min-w-[200px] bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {initialData ? 'Update Room' : 'Create Room'}
        </Button>
      </div>
    </form>
  )
}

export default RoomForm