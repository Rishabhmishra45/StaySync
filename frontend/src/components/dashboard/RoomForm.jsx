import React, { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { statesService } from '../../services/api/states'
import { citiesService } from '../../services/api/cities'
import Input from '../ui/Input'
import Select from '../ui/Select'
import TextArea from '../ui/TextArea'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { Upload, Image as ImageIcon, X, Plus, Eye } from 'lucide-react'

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
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  landmark: z.string().optional(),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
  parkingIncluded: z.boolean().default(false),
  breakfastIncluded: z.boolean().default(false),
  amenities: z.array(z.string()).default([])
})

const amenitiesOptions = [
  { value: 'wifi', label: 'WiFi', icon: '📶' },
  { value: 'tv', label: 'TV', icon: '📺' },
  { value: 'ac', label: 'Air Conditioning', icon: '❄️' },
  { value: 'heating', label: 'Heating', icon: '🔥' },
  { value: 'minibar', label: 'Minibar', icon: '🍷' },
  { value: 'safe', label: 'Safe', icon: '🔒' },
  { value: 'balcony', label: 'Balcony', icon: '🌅' },
  { value: 'pool_view', label: 'Pool View', icon: '🏊' },
  { value: 'sea_view', label: 'Sea View', icon: '🌊' },
  { value: 'breakfast_included', label: 'Breakfast Included', icon: '🍳' },
  { value: 'room_service', label: 'Room Service', icon: '🛎️' },
  { value: 'parking', label: 'Parking', icon: '🚗' },
  { value: 'gym_access', label: 'Gym Access', icon: '💪' },
  { value: 'spa_access', label: 'Spa Access', icon: '🧖' },
  { value: 'laundry', label: 'Laundry', icon: '👕' }
]

const roomTypes = [
  { value: 'single', label: 'Single Room', description: 'Perfect for solo travelers' },
  { value: 'double', label: 'Double Room', description: 'Ideal for couples' },
  { value: 'suite', label: 'Suite', description: 'Spacious with separate living area' },
  { value: 'deluxe', label: 'Deluxe Room', description: 'Premium accommodations' },
  { value: 'presidential', label: 'Presidential Suite', description: 'Ultimate luxury experience' }
]

const RoomForm = ({ onSubmit, loading, initialData }) => {
  const [selectedState, setSelectedState] = useState(initialData?.state || '')
  const [images, setImages] = useState(initialData?.images || [])
  const [uploading, setUploading] = useState(false)

  // Fetch states
  const { data: statesResponse, isLoading: loadingStates } = useQuery({
    queryKey: ['states'],
    queryFn: () => statesService.getAll(),
  })

  // Fetch cities based on selected state
  const { data: citiesResponse, isLoading: loadingCities } = useQuery({
    queryKey: ['cities', selectedState],
    queryFn: () => citiesService.getByState(selectedState),
    enabled: !!selectedState,
  })

  // Process states data
  const states = useMemo(() => {
    if (!statesResponse) return []
    
    if (Array.isArray(statesResponse)) {
      return statesResponse
    }
    
    if (statesResponse.data && Array.isArray(statesResponse.data)) {
      return statesResponse.data
    }
    
    if (statesResponse.success && statesResponse.data && Array.isArray(statesResponse.data)) {
      return statesResponse.data
    }
    
    return []
  }, [statesResponse])

  // Process cities data
  const cities = useMemo(() => {
    if (!citiesResponse || !selectedState) return []
    
    if (Array.isArray(citiesResponse)) {
      return citiesResponse
    }
    
    if (citiesResponse.data && Array.isArray(citiesResponse.data)) {
      return citiesResponse.data
    }
    
    if (citiesResponse.success && citiesResponse.data && Array.isArray(citiesResponse.data)) {
      return citiesResponse.data
    }
    
    return []
  }, [citiesResponse, selectedState])

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: initialData || {
      name: '',
      type: 'double',
      description: '',
      pricePerNight: 100,
      capacity: 2,
      size: 300,
      beds: '1 King Bed',
      bathrooms: 1,
      floor: 1,
      state: '',
      city: '',
      address: '',
      landmark: '',
      pincode: '',
      featured: false,
      available: true,
      parkingIncluded: false,
      breakfastIncluded: false,
      amenities: []
    }
  })

  const watchType = watch('type')
  const watchState = watch('state')
  const watchCity = watch('city')
  const watchAmenities = watch('amenities') || []

  const handleStateChange = (stateId) => {
    setSelectedState(stateId)
    setValue('state', stateId)
    setValue('city', '') // Reset city when state changes
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 10) {
      alert('Maximum 10 images allowed')
      return
    }

    setUploading(true)
    
    // Simulate upload (in real app, upload to Cloudinary/S3)
    setTimeout(() => {
      const newImages = files.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        isPrimary: images.length === 0 // First image is primary
      }))
      
      setImages(prev => [...prev, ...newImages])
      setUploading(false)
    }, 1000)
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const setPrimaryImage = (index) => {
    setImages(prev => 
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    )
  }

  const toggleAmenity = (amenityValue) => {
    const currentAmenities = watchAmenities
    const newAmenities = currentAmenities.includes(amenityValue)
      ? currentAmenities.filter(a => a !== amenityValue)
      : [...currentAmenities, amenityValue]
    
    setValue('amenities', newAmenities)
  }

  const handleFormSubmit = (data) => {
    const formData = {
      ...data,
      images: images.map(img => ({
        url: img.url,
        isPrimary: img.isPrimary
      }))
    }
    onSubmit(formData)
  }

  return (
    <form id="room-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Information Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Room Name *"
            placeholder="e.g., Deluxe Ocean View Suite"
            {...register('name')}
            error={errors.name?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Room Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {roomTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setValue('type', type.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    watchType === type.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-accent text-foreground'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">{type.label}</div>
                  <div className="text-xs text-muted-foreground">{type.description}</div>
                </button>
              ))}
            </div>
            {errors.type && (
              <p className="text-sm text-destructive mt-1">{errors.type.message}</p>
            )}
          </div>

          <Input
            label="Price per Night ($) *"
            type="number"
            placeholder="99"
            {...register('pricePerNight')}
            error={errors.pricePerNight?.message}
            required
          />

          <Input
            label="Capacity (Guests) *"
            type="number"
            placeholder="2"
            {...register('capacity')}
            error={errors.capacity?.message}
            required
          />

          <Input
            label="Room Size (sqft) *"
            type="number"
            placeholder="300"
            {...register('size')}
            error={errors.size?.message}
            required
          />

          <Input
            label="Beds Configuration *"
            placeholder="e.g., 1 King Bed, 2 Queen Beds"
            {...register('beds')}
            error={errors.beds?.message}
            required
          />

          <Input
            label="Bathrooms *"
            type="number"
            placeholder="1"
            {...register('bathrooms')}
            error={errors.bathrooms?.message}
            required
          />

          <Input
            label="Floor *"
            type="number"
            placeholder="1"
            {...register('floor')}
            error={errors.floor?.message}
            required
          />
        </div>

        <TextArea
          label="Description *"
          rows={4}
          placeholder="Describe the room features, view, and special amenities..."
          {...register('description')}
          error={errors.description?.message}
          className="mt-6"
          required
        />
      </Card>

      {/* Location Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Location Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="State *"
            options={[
              { value: '', label: loadingStates ? 'Loading states...' : 'Select a state' },
              ...states.map(state => ({
                value: state._id || state.id,
                label: state.name
              }))
            ]}
            value={watchState}
            onChange={handleStateChange}
            error={errors.state?.message}
            required
          />

          <Select
            label="City *"
            options={[
              { value: '', label: loadingCities ? 'Loading cities...' : watchState ? 'Select a city' : 'Select state first' },
              ...cities.map(city => ({
                value: city._id || city.id,
                label: city.name
              }))
            ]}
            value={watchCity}
            onChange={(value) => setValue('city', value)}
            error={errors.city?.message}
            required
            disabled={!watchState || loadingCities}
          />

          <div className="md:col-span-2">
            <Input
              label="Full Address *"
              placeholder="Street address, area, locality"
              {...register('address')}
              error={errors.address?.message}
              required
            />
          </div>

          <Input
            label="Landmark (Optional)"
            placeholder="Nearby landmark for easy location"
            {...register('landmark')}
            error={errors.landmark?.message}
          />

          <Input
            label="Pincode *"
            placeholder="560001"
            {...register('pincode')}
            error={errors.pincode?.message}
            required
          />
        </div>
      </Card>

      {/* Images Upload Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Room Images</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Upload high-quality images of the room (Max 10 images)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                First image will be used as primary/featured image
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {images.length} / 10 images
              </span>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading || images.length >= 10}
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer flex flex-col items-center justify-center space-y-4 ${
                uploading || images.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                ) : (
                  <Upload className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP up to 5MB each
                </p>
              </div>
            </label>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-foreground mb-4">Uploaded Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative group rounded-lg overflow-hidden border-2 ${
                      image.isPrimary ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Room image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    
                    {/* Image Actions Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className={`p-2 rounded-full ${
                          image.isPrimary
                            ? 'bg-primary text-white'
                            : 'bg-white/90 text-foreground hover:bg-white'
                        }`}
                        title={image.isPrimary ? 'Primary Image' : 'Set as Primary'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 rounded-full bg-destructive text-white hover:bg-destructive/90"
                        title="Remove Image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Primary Badge */}
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
                          Primary
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Amenities Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Amenities & Features</h2>
        
        <div>
          <label className="block text-sm font-medium mb-4 text-foreground">
            Select available amenities *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {amenitiesOptions.map((amenity) => {
              const isSelected = watchAmenities.includes(amenity.value)
              return (
                <button
                  key={amenity.value}
                  type="button"
                  onClick={() => toggleAmenity(amenity.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-accent text-foreground'
                  }`}
                >
                  <span className="text-xl mb-2">{amenity.icon}</span>
                  <span className="text-sm font-medium">{amenity.label}</span>
                </button>
              )
            })}
          </div>
          {errors.amenities && (
            <p className="text-sm text-destructive mt-2">{errors.amenities.message}</p>
          )}
        </div>

        {/* Additional Features */}
        <div className="mt-8">
          <label className="block text-sm font-medium mb-4 text-foreground">
            Additional Features
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                {...register('featured')}
                className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
              />
              <div>
                <span className="font-medium text-foreground">Featured Room</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Show in featured section
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                {...register('available')}
                className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
              />
              <div>
                <span className="font-medium text-foreground">Available</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Room is available for booking
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                {...register('parkingIncluded')}
                className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
              />
              <div>
                <span className="font-medium text-foreground">Parking Included</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Free parking available
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                {...register('breakfastIncluded')}
                className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
              />
              <div>
                <span className="font-medium text-foreground">Breakfast Included</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Complimentary breakfast
                </p>
              </div>
            </label>
          </div>
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          <p>* Required fields</p>
          <p className="mt-1">Please fill all required information before submitting</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading || images.length === 0}
            className="min-w-32"
          >
            {initialData ? 'Update Room' : 'Create Room'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default RoomForm