import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Home, MapPin, CreditCard, Download, Printer, Share2, MessageCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { bookingsService } from '../../services/api/bookings'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { formatDate, formatDateTime, formatCurrency, calculateNights } from '../../utils/formatters'

const BookingDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsService.getMyBookings().then(bookings => 
      bookings.find(b => b._id === id)
    ),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The booking you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/dashboard/bookings')}>
            Back to Bookings
          </Button>
        </Card>
      </div>
    )
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut)

  return (
    <>
      <Helmet>
        <title>Booking #{booking._id.slice(-8)} - StaySynce</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/bookings')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Booking Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Booking ID: #{booking._id.slice(-8)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Invoice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Summary */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Booking Summary
                </h2>
                <Badge variant={
                  booking.status === 'confirmed' ? 'success' :
                  booking.status === 'pending' ? 'warning' :
                  booking.status === 'cancelled' ? 'danger' : 'info'
                }>
                  {booking.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Check-in</p>
                      <p className="font-medium">{formatDate(booking.checkIn)}</p>
                      <p className="text-sm text-gray-500">2:00 PM onwards</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Check-out</p>
                      <p className="font-medium">{formatDate(booking.checkOut)}</p>
                      <p className="text-sm text-gray-500">Before 11:00 AM</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Guest</p>
                      <p className="font-medium">{booking.user?.name}</p>
                      <p className="text-sm text-gray-500">{booking.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                      <p className="font-medium">{nights} nights</p>
                      <p className="text-sm text-gray-500">{nights + 1} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Room Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Room Details
              </h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={booking.room?.images?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800'}
                    alt={booking.room?.name}
                    className="w-full h-48 md:h-full object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.room?.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{booking.room?.type}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Room Size</p>
                      <p className="font-medium">{booking.room?.size} sqft</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
                      <p className="font-medium">{booking.room?.capacity} Guests</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Beds</p>
                      <p className="font-medium">{booking.room?.beds}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Floor</p>
                      <p className="font-medium">Floor {booking.room?.floor}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {booking.room?.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Special Requests */}
            {booking.specialRequests && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Special Requests
                </h2>
                <p className="text-gray-700 dark:text-gray-300">{booking.specialRequests}</p>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Price Breakdown */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Price Breakdown
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatCurrency(booking.room?.pricePerNight)} × {nights} nights
                  </span>
                  <span>{formatCurrency(booking.room?.pricePerNight * nights)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service fee</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Taxes</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(booking.totalAmount)}</span>
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Payment Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.paymentMethod || 'Credit Card'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                  <Badge variant="success">Paid</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</p>
                  <p className="font-mono text-sm">TX_{booking._id.slice(-12)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Booked On</p>
                  <p>{formatDateTime(booking.createdAt)}</p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Actions
              </h2>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Support
                </Button>
                {booking.status === 'pending' && (
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    Confirm Payment
                  </Button>
                )}
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <Button variant="danger" className="w-full">
                    Cancel Booking
                  </Button>
                )}
                {booking.status === 'checked_in' && (
                  <Button variant="outline" className="w-full">
                    Request Late Checkout
                  </Button>
                )}
              </div>
            </Card>

            {/* Help */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  📞 <span className="font-medium">+1 (555) 123-4567</span>
                </p>
                <p className="text-sm">
                  ✉️ <span className="font-medium">support@staysynce.com</span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookingDetails