import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, Users, Star, Check, X, ChevronLeft, ChevronRight, Wifi, Tv, Coffee, Wind, Car, Shield, MapPin, Maximize, Bed, Bath } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { roomsService } from '../../services/api/rooms'
import { bookingsService } from '../../services/api/bookings'
import { useAuth } from '../../app/providers/AuthProvider'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const bookingSchema = z.object({
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.coerce.number().min(1, 'At least 1 guest is required').max(10, 'Maximum 10 guests'),
  specialRequests: z.string().optional()
})

const RoomDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [currentImage, setCurrentImage] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const { data: room, isLoading, isError } = useQuery({
    queryKey: ['room', id],
    queryFn: () => roomsService.getById(id),
    enabled: !!id
  })

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: '',
      checkOut: '',
      guests: 1,
      specialRequests: ''
    }
  })

  const watchCheckIn = watch('checkIn')
  const watchCheckOut = watch('checkOut')
  const watchGuests = watch('guests')

  const calculateTotal = () => {
    if (!watchCheckIn || !watchCheckOut || !room) return 0
    const nights = Math.ceil((new Date(watchCheckOut) - new Date(watchCheckIn)) / (1000 * 60 * 60 * 24))
    return nights * room.pricePerNight
  }

  const bookingMutation = useMutation({
    mutationFn: (bookingData) => bookingsService.create({
      ...bookingData,
      roomId: id,
      totalAmount: calculateTotal()
    }),
    onSuccess: () => {
      toast.success('Booking created successfully!')
      setShowBookingModal(false)
      reset()
      navigate('/dashboard/bookings')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create booking')
    }
  })

  const amenities = [
    { icon: <Wifi className="w-5 h-5" />, label: 'High-Speed WiFi', included: true },
    { icon: <Tv className="w-5 h-5" />, label: 'Smart TV', included: true },
    { icon: <Coffee className="w-5 h-5" />, label: 'Coffee Maker', included: true },
    { icon: <Wind className="w-5 h-5" />, label: 'Air Conditioning', included: true },
    { icon: <Car className="w-5 h-5" />, label: 'Free Parking', included: room?.parkingIncluded || false },
    { icon: <Shield className="w-5 h-5" />, label: 'Room Safe', included: true }
  ]

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }
    setShowBookingModal(true)
  }

  const onSubmit = (data) => {
    bookingMutation.mutate(data)
  }

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false)
    navigate('/login', { state: { from: `/rooms/${id}` } })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Room Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The room you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/rooms')}>
            Browse Available Rooms
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{room.name} - StaySynce</title>
        <meta name="description" content={room.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Image Gallery */}
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 flex">
            {room.images?.map((img, index) => (
              <motion.div
                key={index}
                className="relative w-full h-full flex-shrink-0"
                animate={{ x: `-${currentImage * 100}%` }}
                transition={{ type: 'spring', damping: 30 }}
              >
                <img
                  src={img || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800'}
                  alt={`${room.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {room.images?.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage(prev => prev === 0 ? room.images.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentImage(prev => (prev + 1) % room.images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {room.images?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImage === index ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{room.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                    <span>{room.rating || '4.5'}</span>
                    <span className="ml-1">({room.reviews || 24} reviews)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Floor {room.floor || '1'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Maximize className="w-4 h-4 mr-1" />
                    <span>{room.size} sqft</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-foreground whitespace-pre-line leading-relaxed">{room.description}</p>
              </Card>

              {/* Room Features */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Room Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">{room.capacity} Guests</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Bed className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Beds</p>
                      <p className="text-sm text-muted-foreground">{room.beds || '1 King Bed'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Bath className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Bathroom</p>
                      <p className="text-sm text-muted-foreground">{room.bathrooms || 'Private'}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Amenities */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${amenity.included ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        {amenity.icon}
                      </div>
                      <span className={amenity.included ? 'text-foreground' : 'text-muted-foreground line-through'}>
                        {amenity.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Reviews Section (Placeholder) */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Guest Reviews</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Excellent Service</p>
                      <p className="text-sm text-muted-foreground">John D. • 2 days ago</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "Amazing stay! The room was clean, spacious, and had all the amenities we needed."
                  </p>
                </div>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-baseline mb-2">
                      <span className="text-3xl font-bold text-primary">${room.pricePerNight}</span>
                      <span className="text-muted-foreground ml-2">per night</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleBookNow}
                    disabled={!room.available}
                  >
                    {room.available ? 'Book Now' : 'Not Available'}
                  </Button>

                  {!room.available && (
                    <p className="text-sm text-red-500 text-center">
                      This room is currently unavailable
                    </p>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="font-medium">2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="font-medium">11:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cancellation</span>
                      <span className="font-medium text-green-600">Free cancellation</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Complete Your Booking"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Check-in Date"
              type="date"
              required
              error={errors.checkIn?.message}
              {...register('checkIn')}
              min={new Date().toISOString().split('T')[0]}
            />
            <Input
              label="Check-out Date"
              type="date"
              required
              error={errors.checkOut?.message}
              {...register('checkOut')}
              min={watchCheckIn || new Date().toISOString().split('T')[0]}
            />
          </div>

          <Select
            label="Number of Guests"
            options={[
              { value: 1, label: '1 Guest' },
              { value: 2, label: '2 Guests' },
              { value: 3, label: '3 Guests' },
              { value: 4, label: '4 Guests' },
              { value: 5, label: '5 Guests' },
              { value: 6, label: '6 Guests' }
            ]}
            value={watchGuests}
            onChange={(value) => register('guests').onChange({ target: { value } })}
            error={errors.guests?.message}
          />

          <Input
            label="Special Requests (Optional)"
            type="textarea"
            rows={3}
            placeholder="Any special requirements or requests?"
            {...register('specialRequests')}
          />

          {/* Price Summary */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Price Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">${room.pricePerNight} × {calculateTotal() / room.pricePerNight || 0} nights</span>
                <span>${room.pricePerNight * (calculateTotal() / room.pricePerNight || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes</span>
                <span>$0</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </Card>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={bookingMutation.isPending}
              disabled={!watchCheckIn || !watchCheckOut || bookingMutation.isPending}
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

      {/* Login Prompt Modal */}
      <Modal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="Login Required"
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <p>You need to be logged in to book a room.</p>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowLoginPrompt(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleLoginRedirect}
            >
              Login
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default RoomDetailsPage