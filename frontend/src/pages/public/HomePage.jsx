// src/pages/public/HomePage.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  Search, Star, Users, Wifi, Coffee, Car, 
  Shield, Utensils, Tv, Wind, ChevronRight,
  ArrowRight, Check, Award, Sparkles, Heart,
  MapPin, Calendar, ChevronLeft, ChevronRight as RightIcon
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { roomsService } from '../../services/api/rooms'
import SearchWidget from '../../components/shared/SearchWidget'
import RoomCard from '../../components/shared/RoomCard'
import Button from '../../components/ui/Button'

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchParams, setSearchParams] = useState({})

  const { data: response, isLoading } = useQuery({
    queryKey: ['featured-rooms'],
    queryFn: () => roomsService.getFeatured()
  })

  // Background image slideshow
  const heroImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1564501049418-3c27787d01e8?auto=format&fit=crop&w=2070&q=80"
  ]

  // Extract rooms from response
  const featuredRooms = response?.data || []
  const rooms = Array.isArray(featuredRooms) ? featuredRooms : []

  const amenities = [
    { icon: <Wifi className="w-6 h-6" />, label: 'High-Speed WiFi', desc: 'Stay connected with fiber internet' },
    { icon: <Coffee className="w-6 h-6" />, label: 'Free Breakfast', desc: 'Delicious breakfast daily' },
    { icon: <Users className="w-6 h-6" />, label: 'Family Friendly', desc: 'Amenities for families' },
    { icon: <Car className="w-6 h-6" />, label: 'Free Parking', desc: 'Secure parking 24/7' },
  ]

  const features = [
    { icon: <Award className="w-5 h-5" />, text: '5-Star Rated' },
    { icon: <Sparkles className="w-5 h-5" />, text: 'Luxury Amenities' },
    { icon: <Shield className="w-5 h-5" />, text: 'Safe & Secure' },
    { icon: <Heart className="w-5 h-5" />, text: 'Premium Service' }
  ]

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <>
      <Helmet>
        <title>StaySynce - Luxury Hotel & Resort</title>
        <meta name="description" content="Experience luxury and comfort at StaySynce. Book your perfect stay today." />
      </Helmet>

      {/* Hero Section with Slideshow */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image}
                alt={`Luxury Hotel ${index + 1}`}
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Dark overlay for better text visibility */}
              <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
            </div>
          ))}
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          aria-label="Next slide"
        >
          <RightIcon className="w-6 h-6" />
        </button>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Premium Luxury Resort
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
              >
                Experience <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Ultimate Luxury</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl"
              >
                StaySynce offers unparalleled luxury accommodations with premium amenities, 
                exceptional service, and memories that last a lifetime.
              </motion.p>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="grid grid-cols-2 gap-4 mb-8"
              >
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="p-1 rounded-full bg-white/20 text-yellow-400">
                      {feature.icon}
                    </div>
                    <span className="text-gray-200">{feature.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  as="a" 
                  href="/rooms"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg shadow-lg"
                >
                  Book Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  as="a" 
                  href="/about"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-8 py-3 rounded-lg"
                >
                  Explore More
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Search Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-white/10 dark:bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Find Your Perfect Stay
                  </h2>
                  <p className="text-gray-200">
                    Search, compare, and book luxury accommodations
                  </p>
                </div>
                <SearchWidget />
                
                {/* Trust Badge */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-200">Best Price</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-200">24/7 Support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-200">Secure Booking</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 right-8 z-20"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary dark:text-primary-light text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              Premium Selection
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured <span className="text-primary dark:text-primary-light">Rooms</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our most luxurious accommodations, designed for ultimate comfort and style
            </p>
          </div>

          {/* Rooms Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
                <Star className="w-full h-full" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Featured Rooms Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Check back soon for our special featured accommodations
              </p>
            </div>
          )}

          {/* View All Button */}
          {rooms.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                as="a" 
                href="/rooms" 
                variant="outline"
                className="group border-primary dark:border-primary-light text-primary dark:text-primary-light hover:bg-primary dark:hover:bg-primary-light hover:text-white px-8 py-3 rounded-lg"
              >
                View All Rooms
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary dark:text-secondary-light text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Amenities
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              World-Class <span className="text-secondary dark:text-secondary-light">Facilities</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience luxury with our premium facilities designed for your comfort
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-primary dark:text-primary-light mb-6 group-hover:scale-110 transition-transform duration-300">
                  {amenity.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-300">
                  {amenity.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {amenity.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/20 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Ready for Your Dream Vacation?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Book your stay today and experience luxury like never before. 
                    Enjoy premium amenities, exceptional service, and create unforgettable memories.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      as="a" 
                      href="/rooms" 
                      className="bg-gradient-to-r from-primary to-secondary dark:from-primary-light dark:to-secondary-light hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-3"
                    >
                      Book Your Stay
                    </Button>
                    <Button 
                      as="a" 
                      href="/contact" 
                      variant="outline"
                      className="border-primary dark:border-primary-light text-primary dark:text-primary-light hover:bg-primary dark:hover:bg-primary-light hover:text-white px-6 py-3"
                    >
                      Contact Us
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary dark:text-primary-light mb-1">98%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Guest Satisfaction</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-secondary dark:text-secondary-light mb-1">24/7</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Customer Support</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary dark:text-primary-light mb-1">5★</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Luxury Rating</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-secondary dark:text-secondary-light mb-1">100+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Happy Guests</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default HomePage