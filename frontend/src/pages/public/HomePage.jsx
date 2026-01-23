// src/pages/public/HomePage.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Search, Star, Users, Wifi, Coffee, Car,
  Shield, Utensils, Tv, Wind, ChevronRight,
  ArrowRight, Check, Award, Sparkles, Heart,
  MapPin, Calendar, ChevronLeft, ChevronRight as RightIcon,
  Home
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { roomsService } from '../../services/api/rooms'
import SearchWidget from '../../components/shared/SearchWidget'
import RoomCard from '../../components/shared/RoomCard'
import Button from '../../components/ui/Button'

/* ✅ StateCard Component (Return se bahar hona chahiye) */
const StateCard = ({ name, description, hotelsCount, image, link }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
  >
    <Link to={link}>
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-sm opacity-90 mb-2">{description}</p>
        <div className="flex items-center text-sm">
          <Home className="w-4 h-4 mr-1" />
          <span>{hotelsCount}</span>
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <Button
          size="sm"
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
        >
          Explore
        </Button>
      </div>
    </Link>
  </motion.div>
)

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const { data: response, isLoading } = useQuery({
    queryKey: ['featured-rooms'],
    queryFn: () => roomsService.getFeatured()
  })

  // Background image slideshow
  const heroImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
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
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

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
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={image}
                alt={`Luxury Hotel ${index + 1}`}
                className="w-full h-full object-cover"
                loading="eager"
              />
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
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
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* ✅ STATES SECTION (Featured Rooms ke baad added) */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary dark:text-primary-light text-sm font-medium mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              Explore By State
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Hotels Across <span className="text-primary dark:text-primary-light">India</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find the perfect stay in your favorite Indian state
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <StateCard
              name="Maharashtra"
              description="The City of Dreams"
              hotelsCount="150+ Hotels"
              image="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80"
              link="/states/maharashtra"
            />
            <StateCard
              name="Goa"
              description="Beach Paradise"
              hotelsCount="200+ Hotels"
              image="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
              link="/states/goa"
            />
            <StateCard
              name="Himachal Pradesh"
              description="Mountain Retreat"
              hotelsCount="120+ Hotels"
              image="https://images.unsplash.com/photo-1599391408303-4cb8b47b8e7c?auto=format&fit=crop&w=800&q=80"
              link="/states/himachal-pradesh"
            />
            <StateCard
              name="Rajasthan"
              description="The Pink City"
              hotelsCount="180+ Hotels"
              image="https://images.unsplash.com/photo-1524307875964-4c93d5c97229?auto=format&fit=crop&w=800&q=80"
              link="/states/rajasthan"
            />
            <StateCard
              name="Kerala"
              description="God's Own Country"
              hotelsCount="160+ Hotels"
              image="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
              link="/states/kerala"
            />
            <StateCard
              name="Tamil Nadu"
              description="Temple State"
              hotelsCount="140+ Hotels"
              image="https://images.unsplash.com/photo-1565950637287-040c2ac78dc9?auto=format&fit=crop&w=800&q=80"
              link="/states/tamil-nadu"
            />
            <StateCard
              name="Uttar Pradesh"
              description="Historical Land"
              hotelsCount="190+ Hotels"
              image="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
              link="/states/uttar-pradesh"
            />
            <StateCard
              name="Gujarat"
              description="Business Hub"
              hotelsCount="130+ Hotels"
              image="https://images.unsplash.com/photo-1524307875964-4c93d5c97229?auto=format&fit=crop&w=800&q=80"
              link="/states/gujarat"
            />
          </div>

          <div className="text-center mt-12">
            <Button
              as="a"
              href="/states"
              variant="outline"
              className="group border-primary dark:border-primary-light text-primary dark:text-primary-light hover:bg-primary dark:hover:bg-primary-light hover:text-white px-8 py-3 rounded-lg"
            >
              View All 28 States
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>
    </>
  )
}

export default HomePage
