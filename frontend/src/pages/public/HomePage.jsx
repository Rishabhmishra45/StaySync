// src/pages/public/HomePage.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search, Star, Users, Wifi, Coffee, Car } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { roomsService } from '../../services/api/rooms'
import SearchWidget from '../../components/shared/SearchWidget'
import RoomCard from '../../components/shared/RoomCard'
import Button from '../../components/ui/Button'

const HomePage = () => {
  const [searchParams, setSearchParams] = useState({})

  const { data: featuredRooms, isLoading } = useQuery({
    queryKey: ['featured-rooms'],
    queryFn: () => roomsService.getAll({ featured: true, limit: 4 })
  })

  const amenities = [
    { icon: <Wifi className="w-6 h-6" />, label: 'High-Speed WiFi', desc: 'Stay connected with our fiber internet' },
    { icon: <Coffee className="w-6 h-6" />, label: 'Free Breakfast', desc: 'Delicious breakfast served daily' },
    { icon: <Users className="w-6 h-6" />, label: 'Family Friendly', desc: 'Special amenities for families' },
    { icon: <Car className="w-6 h-6" />, label: 'Free Parking', desc: 'Secure parking available 24/7' },
  ]

  return (
    <>
      <Helmet>
        <title>StaySynce - Luxury Hotel Management</title>
        <meta name="description" content="Experience luxury and comfort at StaySynce. Book your perfect stay today." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2070')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Experience Luxury Redefined
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              StaySynce offers unparalleled comfort and service for your perfect getaway
            </p>
          </motion.div>

          {/* Search Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto"
          >
            <SearchWidget />
          </motion.div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Rooms</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most sought-after accommodations
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-lg"></div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRooms?.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">World-Class Amenities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for a perfect stay
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                  {amenity.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{amenity.label}</h3>
                <p className="text-muted-foreground">{amenity.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage