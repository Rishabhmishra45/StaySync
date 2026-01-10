import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Grid, List, Search, X } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { roomsService } from '../../services/api/rooms'
import RoomCard from '../../components/shared/RoomCard'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Pagination from '../../components/ui/Pagination'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || '',
    roomType: searchParams.get('roomType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'price_asc'
  })
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const { data: rooms, isLoading, isError } = useQuery({
    queryKey: ['rooms', filters, currentPage],
    queryFn: () => roomsService.getAll({
      ...filters,
      page: currentPage,
      limit: itemsPerPage
    }),
    keepPreviousData: true
  })

  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: '',
      roomType: '',
      minPrice: '',
      maxPrice: '',
      sort: 'price_asc'
    })
    setCurrentPage(1)
  }

  const roomTypes = [
    { value: '', label: 'All Types' },
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Double' },
    { value: 'suite', label: 'Suite' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'presidential', label: 'Presidential' }
  ]

  const sortOptions = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating_desc', label: 'Highest Rated' },
    { value: 'name_asc', label: 'Name: A to Z' }
  ]

  const totalPages = Math.ceil((rooms?.total || 0) / itemsPerPage)

  return (
    <>
      <Helmet>
        <title>Rooms - StaySynce</title>
        <meta name="description" content="Browse our premium selection of rooms and suites at StaySynce" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find Your Perfect Room
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our selection of premium accommodations
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {/* Filters Sidebar - Mobile */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden overflow-hidden"
                >
                  <Card className="p-6 mb-6">
                    <Filters
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      roomTypes={roomTypes}
                      clearFilters={clearFilters}
                    />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block lg:w-1/4">
              <Card className="p-6 sticky top-24">
                <Filters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  roomTypes={roomTypes}
                  clearFilters={clearFilters}
                />
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div className="mb-4 sm:mb-0">
                  <p className="text-foreground">
                    Showing <span className="font-semibold">{rooms?.length || 0}</span> rooms
                    {filters.location && ` in ${filters.location}`}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-48">
                    <Select
                      options={sortOptions}
                      value={filters.sort}
                      onChange={(value) => handleFilterChange('sort', value)}
                    />
                  </div>
                  
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-foreground'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-foreground'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              )}

              {/* Error State */}
              {isError && (
                <Card className="p-12 text-center">
                  <p className="text-lg text-red-500 mb-4">Failed to load rooms</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </Card>
              )}

              {/* Rooms Grid/List */}
              {!isLoading && !isError && (
                <>
                  {rooms?.length > 0 ? (
                    <>
                      <div className={
                        viewMode === 'grid' 
                          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                          : 'space-y-6'
                      }>
                        {rooms.map((room) => (
                          viewMode === 'grid' ? (
                            <RoomCard key={room._id} room={room} />
                          ) : (
                            <RoomListItem key={room._id} room={room} />
                          )
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-8">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <Card className="p-12 text-center">
                      <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your filters or search criteria
                      </p>
                      <Button onClick={clearFilters}>
                        Clear All Filters
                      </Button>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Filter Component
const Filters = ({ filters, onFilterChange, roomTypes, clearFilters }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Filters</h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={clearFilters}
        className="text-sm"
      >
        Clear All
      </Button>
    </div>

    <Input
      label="Location"
      placeholder="Enter location"
      value={filters.location}
      onChange={(e) => onFilterChange('location', e.target.value)}
    />

    <div className="grid grid-cols-2 gap-4">
      <Input
        label="Min Price"
        type="number"
        placeholder="$0"
        value={filters.minPrice}
        onChange={(e) => onFilterChange('minPrice', e.target.value)}
      />
      <Input
        label="Max Price"
        type="number"
        placeholder="$1000"
        value={filters.maxPrice}
        onChange={(e) => onFilterChange('maxPrice', e.target.value)}
      />
    </div>

    <Select
      label="Room Type"
      options={roomTypes}
      value={filters.roomType}
      onChange={(value) => onFilterChange('roomType', value)}
    />

    <Input
      label="Guests"
      type="number"
      min="1"
      placeholder="Number of guests"
      value={filters.guests}
      onChange={(e) => onFilterChange('guests', e.target.value)}
    />

    <div className="space-y-4">
      <h4 className="font-medium">Amenities</h4>
      {['wifi', 'tv', 'ac', 'breakfast', 'parking'].map((amenity) => (
        <label key={amenity} className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="ml-2 capitalize">{amenity}</span>
        </label>
      ))}
    </div>
  </div>
)

// Room List Item Component
const RoomListItem = ({ room }) => (
  <Card hoverable className="flex flex-col md:flex-row">
    <div className="md:w-1/3">
      <img
        src={room.images?.[0]}
        alt={room.name}
        className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
      />
    </div>
    <div className="md:w-2/3 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{room.name}</h3>
          <p className="text-muted-foreground mt-2 line-clamp-2">{room.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">${room.pricePerNight}</p>
          <p className="text-sm text-muted-foreground">per night</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <span>⭐ {room.rating || '4.5'}</span>
        <span>👥 {room.capacity} Guests</span>
        <span>📏 {room.size} sqft</span>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <Button variant="outline">View Details</Button>
        <Button>Book Now</Button>
      </div>
    </div>
  </Card>
)

export default RoomsPage